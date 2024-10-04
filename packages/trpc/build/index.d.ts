export declare const appRouter: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
    transformer: false;
}, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    test: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
        transformer: false;
    }, {
        test: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string;
        }>;
    }>;
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map