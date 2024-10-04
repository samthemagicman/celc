import { publicProcedure, router } from "../../trpc";
export const testRouter = router({
    test: publicProcedure.query((opts) => {
        return "whatsup";
    })
});
