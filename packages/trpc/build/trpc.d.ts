/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export declare const router: {
    <TInput extends import("@trpc/server").RouterRecord>(input: TInput): import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
        transformer: false;
    }, TInput>;
    <TInput extends import("@trpc/server/unstable-core-do-not-import").CreateRouterOptions>(input: TInput): import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
        transformer: false;
    }, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<TInput>>;
};
export declare const publicProcedure: import("@trpc/server/unstable-core-do-not-import").ProcedureBuilder<object, object, object, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map