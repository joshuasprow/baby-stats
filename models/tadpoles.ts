// Thanks! https://transform.tools/typescript-to-zod

import { z } from "zod";

export const Action = z.union([
  z.literal("Notify"),
  z.literal("ShareOnly"),
  z.literal("Text"),
]);
export type Action = z.infer<typeof Action>;

export const ActorDisplay = z.union([
  z.literal("Caterpillar"),
  z.literal("Jennifer"),
  z.literal("Rachel"),
  z.literal("Tara"),
  z.literal("Kasey"),
]);
export type ActorDisplay = z.infer<typeof ActorDisplay>;

export const ActorUid = z.union([
  z.literal("gold:1507591"),
  z.literal("jenn@bullfrogkids.com"),
  z.literal("rachelsprow@gmail.com"),
  z.literal("tara@bullfrogkids.com"),
  z.literal("kasey@bullfrogkids.com"),
]);
export type ActorUid = z.infer<typeof ActorUid>;

export const CDomain = z.union([
  z.literal("tsg.d|201"),
  z.literal("tsg.d|204"),
  z.literal("tsg.d|202"),
]);
export type CDomain = z.infer<typeof CDomain>;

export const Category = z.union([
  z.literal("Default"),
  z.literal("mmoinv"),
  z.literal("ChildrensBook"),
  z.literal("MightyMinutesActivity"),
  z.literal("s2cvid"),
  z.literal("s2ctext"),
]);
export type Category = z.infer<typeof Category>;

export const Actor = z.union([
  z.literal("Chelsey Burnett"),
  z.literal("Shannon Stewart"),
  z.literal("Elisha Layton"),
  z.literal("Sydney Hagen"),
  z.literal("Maddy Pfau"),
  z.literal("Jennifer Macdonald"),
  z.literal("Elise Campbell"),
  z.literal("Cassee J Biteman"),
  z.literal("Kasey Fuller"),
  z.literal("Shalyn Macdonald"),
  z.literal("Skylar Shelner"),
  z.literal("Aubrey Carver"),
  z.literal("Sabrina Proia"),
  z.literal("Katie J Harrop"),
  z.literal("Hillary Bishop"),
]);
export type Actor = z.infer<typeof Actor>;

export const Language = z.union([z.literal("en_US"), z.literal("es_US")]);
export type Language = z.infer<typeof Language>;

export const MImeType = z.union([
  z.literal("image/jpeg"),
  z.literal("application/x-mpegURL"),
  z.literal("application/pdf"),
]);
export type MImeType = z.infer<typeof MImeType>;

export const NewAttachmentSource = z.union([
  z.literal("providerapp"),
  z.literal("dashboard"),
]);
export type NewAttachmentSource = z.infer<typeof NewAttachmentSource>;

export const Status = z.literal("ready");
export type Status = z.infer<typeof Status>;

export const Storage = z.union([z.literal("g"), z.literal("v")]);
export type Storage = z.infer<typeof Storage>;

export const BathroomType = z.literal("diaper");
export type BathroomType = z.infer<typeof BathroomType>;

export const Type = z.literal("infant");
export type Type = z.infer<typeof Type>;

export const Contents = z.union([
  z.literal("Formula"),
  z.literal("breastmilk"),
  z.literal("formula"),
  z.literal("Breastmilk"),
  z.literal("milk"),
]);
export type Contents = z.infer<typeof Contents>;

export const FoodEntry = z.object({
  amount: z.string(),
  foods: z.string(),
});
export type FoodEntry = z.infer<typeof FoodEntry>;

export const Measure = z.union([z.literal("oz"), z.literal("F")]);
export type Measure = z.infer<typeof Measure>;

export const EntrySource = z.union([z.literal("tp"), z.literal("ts")]);
export type EntrySource = z.infer<typeof EntrySource>;

export const TsgType = z.union([z.literal("ite"), z.literal("custom")]);
export type TsgType = z.infer<typeof TsgType>;

export const EntryType = z.union([
  z.literal("bathroom"),
  z.literal("nap"),
  z.literal("note"),
  z.literal("food"),
  z.literal("activity"),
  z.literal("skin_application"),
  z.literal("medication"),
  z.literal("health"),
]);
export type EntryType = z.infer<typeof EntryType>;

export const Label = z.union([
  z.literal("social-emotional"),
  z.literal("fun photo"),
  z.literal("social-emotional, cognitive"),
  z.literal("physical"),
  z.literal(""),
  z.literal("physical, cognitive"),
  z.literal("cognitive"),
]);
export type Label = z.infer<typeof Label>;

export const Display = z.union([
  z.literal("Bullfrogs & Butterflies"),
  z.literal("Genevieve"),
  z.literal("Caterpillar"),
  z.literal("Marcus"),
  z.literal("Sophia"),
  z.literal("Jax"),
  z.literal("Elizabeth"),
  z.literal("Eliza"),
  z.literal("Mason"),
]);
export type Display = z.infer<typeof Display>;

export const Scope = z.union([
  z.literal("dependant"),
  z.literal("location"),
  z.literal("group"),
]);
export type Scope = z.infer<typeof Scope>;

export const EventType = z.union([
  z.literal("Activity"),
  z.literal("Note"),
  z.literal("DailyReport"),
  z.literal("FamilyReport"),
]);
export type EventType = z.infer<typeof EventType>;

export const Tz = z.literal("America/New_York");
export type Tz = z.infer<typeof Tz>;

export const Visibility = z.union([
  z.literal("p"),
  z.literal("d"),
  z.literal("t"),
]);
export type Visibility = z.infer<typeof Visibility>;

export const NewAttachment = z.object({
  duration: z.null(),
  filename: z.string().nullable(),
  height: z.null(),
  key: z.string(),
  language: Language,
  mime_type: MImeType,
  source: NewAttachmentSource.nullable(),
  status: Status,
  storage: Storage,
  width: z.null(),
});
export type NewAttachment = z.infer<typeof NewAttachment>;

export const Translations = z.object({
  additional_resources: z.string().optional().nullable(),
  books: z.string().optional().nullable(),
  challenge: z.string().optional().nullable(),
  extend: z.string().optional().nullable(),
  journals: z.string().optional().nullable(),
  not_ready: z.string().optional().nullable(),
  summary: z.string().optional(),
  title: z.string().optional(),
  video: NewAttachment.optional(),
  vimeo_id: z.string().optional(),
  why: z.string().optional().nullable(),
  cover_art: NewAttachment.optional(),
  description: z.string().optional(),
  ODL_version_id: z.number().optional(),
  adaptation: z.string().optional(),
  asset_code: z.string().optional(),
  class_type: z.string().optional(),
  dimension_code: z.string().optional(),
  dimension_description: z.string().optional(),
  dimension_id: z.number().optional(),
  objective_code: z.string().optional(),
  objective_description: z.string().optional(),
  related_dimensions: z.string().optional(),
  what_you_do: z.string().optional(),
  what_you_do_family: z.string().optional(),
});
export type Translations = z.infer<typeof Translations>;

export const Entry = z.object({
  bathroom_type: BathroomType.optional(),
  can_share_attachment: z.boolean().optional(),
  checks: z.null().optional(),
  child_type: Type.optional(),
  classification: z.string().optional(),
  id: z.string().optional(),
  parent: z.boolean().optional(),
  prepared_actor: Actor.nullable().optional(),
  start_time: z.number().optional(),
  type: EntryType,
  details: z.string().optional(),
  end_time: z.number().optional(),
  note: z.string().optional(),
  actor: Actor.optional(),
  contents: Contents.optional(),
  measure: Measure.optional(),
  quantity: z.union([z.number(), z.string()]).optional(),
  amount_offered: z.number().optional(),
  food_entries: z.array(FoodEntry).optional(),
  attachment: NewAttachment.optional(),
  c_goal_labels: z.array(z.string()).optional(),
  sort_order: z.number().optional().nullable(),
  source: EntrySource.optional(),
  tsg_type: TsgType.optional().nullable(),
  unmodified_classification: Label.optional(),
  name: z.string().optional(),
});
export type Entry = z.infer<typeof Entry>;

export const Translation = z.object({
  external_asset_id: z.string().nullable(),
  language: Language,
  translations: Translations,
});
export type Translation = z.infer<typeof Translation>;

export const Metadata = z.object({
  actor: z.null(),
  deleted: z.boolean(),
  id: z.number(),
  ordinal: z.number(),
  playlist_key: z.string(),
  primary: z.boolean(),
  translations: z.array(Translation),
  type: z.string(),
});
export type Metadata = z.infer<typeof Metadata>;

export const Event = z.object({
  action: Action,
  actor: z.string().nullable(),
  actor_display: ActorDisplay.nullable(),
  actor_uid: ActorUid.nullable(),
  attachments: z.array(z.string()),
  category: Category,
  comment: z.string().nullable(),
  complete: z.null(),
  content_id: z.string().nullable(),
  create_time: z.number(),
  dismissed: z.boolean().nullable(),
  event_date: z.date(),
  event_eta: z.null(),
  event_time: z.number(),
  favorite: z.null(),
  formatted_comment: z.string().nullable(),
  group: z.string().nullable(),
  grouped_event_id: z.string().nullable(),
  grouped_event_is_primary: z.boolean(),
  html_comment: z.string().nullable(),
  in_outbox: z.boolean(),
  key: z.string(),
  labels: z.array(Label).optional(),
  linked_event: z.null(),
  location: z.string(),
  location_display: Display,
  member: z.string().nullable(),
  member_display: Display,
  members: z.array(z.string()),
  members_display: z.array(Display),
  metadata: Metadata.nullable(),
  new_attachments: z.array(NewAttachment),
  parent_member_display: Display.nullable(),
  recipients: z.array(z.unknown()),
  scope: Scope,
  source: EntrySource,
  title: z.string().nullable(),
  tsg_id: z.null(),
  tsg_link_status: z.null(),
  type: EventType,
  tz: Tz,
  unmodified_labels: z.array(Label).optional(),
  update_time: z.number(),
  visibility: z.array(Visibility),
  entries: z.array(Entry).optional(),
  report_type: Type.optional(),
  server_report_key: z.string().optional(),
  c_domains: z.array(CDomain).optional(),
  c_goal_labels: z.array(z.string()).optional(),
  c_goals: z.array(z.string()).optional(),
});
export type Event = z.infer<typeof Event>;

export const ApiResonse = z.object({
  cursor: z.string(),
  events: z.array(Event),
  linked_events: z.array(z.unknown()),
});
export type ApiResonse = z.infer<typeof ApiResonse>;
