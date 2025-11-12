import { authRouter } from "./auth";
import { resumeRouter } from "./resume";
import { storageRouter } from "./storage";

export default {
	auth: authRouter,
	resume: resumeRouter,
	storage: storageRouter,
};
