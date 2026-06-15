import { z } from "zod";
import { profileSchema } from "../utils/schema";

export type ProfileFormData = z.infer<typeof profileSchema>;
