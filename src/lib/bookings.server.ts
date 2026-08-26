import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import type {
  BookingStatus,
  ClientDetails,
  LocationType,
  PaymentMethod,
  SavedBooking,
} from "@/lib/booking-store";

const DEFAULT_ADMIN_PASSWORD = "VelvetMoon2026!";

function adminPassword(): string {
  const fromEnv =
    process.env.ADMIN_PASSWORD?.trim() ||
    process.env.VITE_ADMIN_PASSWORD?.trim();
  return fromEnv || DEFAULT_ADMIN_PASSWORD;
}

function assertAdmin(password: string | undefined) {
  if (!password || password !== adminPassword()) {
    throw new Error("Unauthorized");
  }
}

type BookingRow = {
  id: string;
  created_at: string | Date;
  service_ids: unknown;
  services: unknown;
  date: string;
  time: string;
  duration_hours: number | string;
  location_type: string;
  client: unknown;
  payment_method: string;
  deposit_only: boolean;
  total: number;
  paid: number;
  status: string;
  proof_data_url: string | null;
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function rowToBooking(row: BookingRow): SavedBooking {
  const date =
    typeof row.date === "string"
      ? row.date.slice(0, 10)
      : new Date(row.date).toISOString().slice(0, 10);
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at);

  return {
    id: row.id,
    createdAt,
    serviceIds: parseJson<string[]>(row.service_ids, []),
    services: parseJson<SavedBooking["services"]>(row.services, []),
    date,
    time: row.time,
    durationHours: Number(row.duration_hours) || 1,
    locationType: row.location_type as LocationType,
    client: parseJson<ClientDetails>(row.client, {
      name: "",
      phone: "",
      email: "",
      address: "",
      preferredContact: "whatsapp",
      notes: "",
    }),
    paymentMethod: row.payment_method as PaymentMethod,
    depositOnly: Boolean(row.deposit_only),
    total: Number(row.total) || 0,
    paid: Number(row.paid) || 0,
    status: row.status as BookingStatus,
    proofDataUrl: row.proof_data_url,
  };
}

export type CreateBookingInput = {
  id: string;
  serviceIds: string[];
  services: SavedBooking["services"];
  date: string;
  time: string;
  durationHours: number;
  locationType: LocationType;
  client: ClientDetails;
  paymentMethod: PaymentMethod;
  depositOnly: boolean;
  total: number;
  paid: number;
  status: BookingStatus;
};

export const createBookingFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: CreateBookingInput }) => {
    const input = data;
    if (!input?.id || !input.date || !input.time || !input.client?.name) {
      throw new Error("Invalid booking payload");
    }

    const sql = await getSql();
    await sql.query(
      `insert into bookings (
        id, service_ids, services, date, time, duration_hours, location_type,
        client, payment_method, deposit_only, total, paid, status
      ) values (
        $1, $2::jsonb, $3::jsonb, $4::date, $5, $6, $7,
        $8::jsonb, $9, $10, $11, $12, $13
      )
      on conflict (id) do nothing`,
      [
        input.id,
        JSON.stringify(input.serviceIds),
        JSON.stringify(input.services),
        input.date,
        input.time,
        input.durationHours,
        input.locationType,
        JSON.stringify(input.client),
        input.paymentMethod,
        input.depositOnly,
        input.total,
        input.paid,
        input.status,
      ],
    );

    return { ok: true as const, id: input.id };
  },
);

export const getBookingFn = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data?: { id?: string } }) => {
    const id = data?.id?.trim();
    if (!id) return null;

    const sql = await getSql();
    const rows = await sql.query<BookingRow>(
      `select * from bookings where id = $1 limit 1`,
      [id],
    );
    if (!rows.length) return null;
    return rowToBooking(rows[0]);
  },
);

export const listBookingsFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data?: { password?: string } }) => {
    assertAdmin(data?.password);
    const sql = await getSql();
    const rows = await sql.query<BookingRow>(
      `select * from bookings order by created_at desc limit 200`,
    );
    return rows.map(rowToBooking);
  },
);

export const updateBookingFn = createServerFn({ method: "POST" }).handler(
  async ({
    data,
  }: {
    data: {
      password?: string;
      id: string;
      status?: BookingStatus;
      proofDataUrl?: string | null;
    };
  }) => {
    assertAdmin(data?.password);
    const id = data.id?.trim();
    if (!id) throw new Error("Missing booking id");

    const sql = await getSql();

    if (data.status != null && data.proofDataUrl !== undefined) {
      await sql.query(
        `update bookings
         set status = $2, proof_data_url = $3, updated_at = now()
         where id = $1`,
        [id, data.status, data.proofDataUrl],
      );
    } else if (data.status != null) {
      await sql.query(
        `update bookings set status = $2, updated_at = now() where id = $1`,
        [id, data.status],
      );
    } else if (data.proofDataUrl !== undefined) {
      await sql.query(
        `update bookings set proof_data_url = $2, updated_at = now() where id = $1`,
        [id, data.proofDataUrl],
      );
    } else {
      throw new Error("Nothing to update");
    }

    const rows = await sql.query<BookingRow>(
      `select * from bookings where id = $1 limit 1`,
      [id],
    );
    return rows.length ? rowToBooking(rows[0]) : null;
  },
);

/** Public: client uploads payment proof (no admin password). */
export const uploadProofFn = createServerFn({ method: "POST" }).handler(
  async ({
    data,
  }: {
    data: { id: string; proofDataUrl: string };
  }) => {
    const id = data?.id?.trim();
    const proof = data?.proofDataUrl;
    if (!id || !proof || !proof.startsWith("data:image/")) {
      throw new Error("Invalid proof upload");
    }
    // Cap ~5MB base64 payload
    if (proof.length > 7_000_000) {
      throw new Error("Image too large");
    }

    const sql = await getSql();
    await sql.query(
      `update bookings
       set proof_data_url = $2, updated_at = now()
       where id = $1 and status = 'pending'`,
      [id, proof],
    );

    const rows = await sql.query<BookingRow>(
      `select * from bookings where id = $1 limit 1`,
      [id],
    );
    return rows.length ? rowToBooking(rows[0]) : null;
  },
);

export const verifyAdminPasswordFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data?: { password?: string } }) => {
    return { ok: data?.password === adminPassword() };
  },
);
