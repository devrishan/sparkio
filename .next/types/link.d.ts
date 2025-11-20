// Type definitions for Next.js routes

/**
 * Internal types used by the Next.js router and Link component.
 * These types are not meant to be used directly.
 * @internal
 */
declare namespace __next_route_internal_types__ {
  type SearchOrHash = `?${string}` | `#${string}`
  type WithProtocol = `${string}:${string}`

  type Suffix = '' | SearchOrHash

  type SafeSlug<S extends string> = S extends `${string}/${string}`
    ? never
    : S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type CatchAllSlug<S extends string> = S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type OptionalCatchAllSlug<S extends string> =
    S extends `${string}${SearchOrHash}` ? never : S

  type StaticRoutes = 
    | `/`
    | `/admin/admins`
    | `/admin/ads`
    | `/admin/dashboard`
    | `/admin/feature-flags`
    | `/admin/maintenance`
    | `/admin/members`
    | `/admin/products`
    | `/admin/referrals`
    | `/admin/security`
    | `/admin/tasks`
    | `/admin/withdrawals`
    | `/admin/submissions`
    | `/member/dashboard`
    | `/member/gamification`
    | `/member/my-products`
    | `/member/products`
    | `/member/referrals`
    | `/member/tasks`
    | `/member/withdraw`
    | `/register`
    | `/login`
    | `/api/admin/feature-flags`
    | `/api/admin/ads`
    | `/api/admin/ads/create`
    | `/api/admin/ads/delete`
    | `/api/admin/ads/update`
    | `/api/admin/maintenance`
    | `/api/admin/products/suggestions`
    | `/api/admin/submissions/review`
    | `/api/admin/tasks/submissions`
    | `/api/admin/tasks/submissions/update`
    | `/api/admin/referrals`
    | `/api/admin/referrals/update`
    | `/api/admin/withdrawals`
    | `/api/admin/withdrawals/process`
    | `/api/auth/login`
    | `/api/auth/logout`
    | `/api/auth/maintenance`
    | `/api/auth/register`
    | `/api/auth/session`
    | `/api/auth/otp/request`
    | `/api/auth/otp/verify`
    | `/api/health`
    | `/api/cron/sync-leaderboards`
    | `/api/leaderboards`
    | `/api/member/gamification`
    | `/api/member/gamification/badges`
    | `/api/member/products`
    | `/api/member/products/suggest`
    | `/api/member/referrals`
    | `/api/member/dashboard`
    | `/api/member/submit-task`
    | `/api/member/wallet`
    | `/api/member/wallet/transactions`
    | `/api/member/tasks/submit`
    | `/api/member/tasks/submissions`
    | `/api/member/withdraw`
    | `/api/products/top-suggestions`
    | `/api/sse/spark`
    | `/api/tasks`
    | `/api/tasks/categories`
    | `/api/webhooks/payouts`
    | `/api/webhooks/payouts/cashfree`
    | `/api/webhooks/payouts/razorpay`
  type DynamicRoutes<T extends string = string> = 
    | `/api/admin/feature-flags/${SafeSlug<T>}`
    | `/api/admin/ads/${SafeSlug<T>}`
    | `/api/admin/products/suggestions/${SafeSlug<T>}/convert`
    | `/api/admin/products/suggestions/${SafeSlug<T>}/feature`
    | `/api/admin/referrals/${SafeSlug<T>}`
    | `/api/leaderboards/${SafeSlug<T>}`
    | `/api/tasks/${SafeSlug<T>}`

  type RouteImpl<T> = 
    | StaticRoutes
    | SearchOrHash
    | WithProtocol
    | `${StaticRoutes}${SearchOrHash}`
    | (T extends `${DynamicRoutes<infer _>}${Suffix}` ? T : never)
    
}

declare module 'next' {
  export { default } from 'next/types/index.js'
  export * from 'next/types/index.js'

  export type Route<T extends string = string> =
    __next_route_internal_types__.RouteImpl<T>
}

declare module 'next/link' {
  import type { LinkProps as OriginalLinkProps } from 'next/dist/client/link.js'
  import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
  import type { UrlObject } from 'url'

  type LinkRestProps = Omit<
    Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      keyof OriginalLinkProps
    > &
      OriginalLinkProps,
    'href'
  >

  export type LinkProps<RouteInferType> = LinkRestProps & {
    /**
     * The path or URL to navigate to. This is the only required prop. It can also be an object.
     * @see https://nextjs.org/docs/api-reference/next/link
     */
    href: __next_route_internal_types__.RouteImpl<RouteInferType> | UrlObject
  }

  export default function Link<RouteType>(props: LinkProps<RouteType>): JSX.Element
}

declare module 'next/navigation' {
  export * from 'next/dist/client/components/navigation.js'

  import type { NavigateOptions, AppRouterInstance as OriginalAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'
  interface AppRouterInstance extends OriginalAppRouterInstance {
    /**
     * Navigate to the provided href.
     * Pushes a new history entry.
     */
    push<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Navigate to the provided href.
     * Replaces the current history entry.
     */
    replace<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Prefetch the provided href.
     */
    prefetch<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>): void
  }

  export declare function useRouter(): AppRouterInstance;
}
