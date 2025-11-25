/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Profile
 *
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>;
/**
 * Model Club
 *
 */
export type Club = $Result.DefaultSelection<Prisma.$ClubPayload>;
/**
 * Model ClubMember
 *
 */
export type ClubMember = $Result.DefaultSelection<Prisma.$ClubMemberPayload>;
/**
 * Model Event
 *
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>;
/**
 * Model EventAttendee
 *
 */
export type EventAttendee =
  $Result.DefaultSelection<Prisma.$EventAttendeePayload>;
/**
 * Model Listing
 *
 */
export type Listing = $Result.DefaultSelection<Prisma.$ListingPayload>;
/**
 * Model Message
 *
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>;
/**
 * Model StudyMaterial
 *
 */
export type StudyMaterial =
  $Result.DefaultSelection<Prisma.$StudyMaterialPayload>;
/**
 * Model MaterialVersion
 *
 */
export type MaterialVersion =
  $Result.DefaultSelection<Prisma.$MaterialVersionPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
    ADMIN: 'ADMIN';
    STUDENT: 'STUDENT';
    FACULTY: 'FACULTY';
  };

  export type UserRole = (typeof UserRole)[keyof typeof UserRole];

  export const ClubRole: {
    ADMIN: 'ADMIN';
    MODERATOR: 'MODERATOR';
    MEMBER: 'MEMBER';
  };

  export type ClubRole = (typeof ClubRole)[keyof typeof ClubRole];

  export const RSVPStatus: {
    GOING: 'GOING';
    MAYBE: 'MAYBE';
    NOT_GOING: 'NOT_GOING';
  };

  export type RSVPStatus = (typeof RSVPStatus)[keyof typeof RSVPStatus];

  export const Condition: {
    NEW: 'NEW';
    LIKE_NEW: 'LIKE_NEW';
    GOOD: 'GOOD';
    FAIR: 'FAIR';
    POOR: 'POOR';
  };

  export type Condition = (typeof Condition)[keyof typeof Condition];

  export const Category: {
    TEXTBOOKS: 'TEXTBOOKS';
    ELECTRONICS: 'ELECTRONICS';
    FURNITURE: 'FURNITURE';
    SUPPLIES: 'SUPPLIES';
    OTHER: 'OTHER';
  };

  export type Category = (typeof Category)[keyof typeof Category];

  export const ListingStatus: {
    ACTIVE: 'ACTIVE';
    SOLD: 'SOLD';
    RESERVED: 'RESERVED';
    DELETED: 'DELETED';
  };

  export type ListingStatus =
    (typeof ListingStatus)[keyof typeof ListingStatus];

  export const MaterialType: {
    NOTES: 'NOTES';
    ASSIGNMENT: 'ASSIGNMENT';
    PAPER: 'PAPER';
    BOOK: 'BOOK';
    OTHER: 'OTHER';
  };

  export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType];
}

export type UserRole = $Enums.UserRole;

export const UserRole: typeof $Enums.UserRole;

export type ClubRole = $Enums.ClubRole;

export const ClubRole: typeof $Enums.ClubRole;

export type RSVPStatus = $Enums.RSVPStatus;

export const RSVPStatus: typeof $Enums.RSVPStatus;

export type Condition = $Enums.Condition;

export const Condition: typeof $Enums.Condition;

export type Category = $Enums.Category;

export const Category: typeof $Enums.Category;

export type ListingStatus = $Enums.ListingStatus;

export const ListingStatus: typeof $Enums.ListingStatus;

export type MaterialType = $Enums.MaterialType;

export const MaterialType: typeof $Enums.MaterialType;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent,
    ) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.club`: Exposes CRUD operations for the **Club** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Clubs
   * const clubs = await prisma.club.findMany()
   * ```
   */
  get club(): Prisma.ClubDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clubMember`: Exposes CRUD operations for the **ClubMember** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ClubMembers
   * const clubMembers = await prisma.clubMember.findMany()
   * ```
   */
  get clubMember(): Prisma.ClubMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
   * ```
   */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventAttendee`: Exposes CRUD operations for the **EventAttendee** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more EventAttendees
   * const eventAttendees = await prisma.eventAttendee.findMany()
   * ```
   */
  get eventAttendee(): Prisma.EventAttendeeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.listing`: Exposes CRUD operations for the **Listing** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Listings
   * const listings = await prisma.listing.findMany()
   * ```
   */
  get listing(): Prisma.ListingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Messages
   * const messages = await prisma.message.findMany()
   * ```
   */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.studyMaterial`: Exposes CRUD operations for the **StudyMaterial** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more StudyMaterials
   * const studyMaterials = await prisma.studyMaterial.findMany()
   * ```
   */
  get studyMaterial(): Prisma.StudyMaterialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.materialVersion`: Exposes CRUD operations for the **MaterialVersion** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more MaterialVersions
   * const materialVersions = await prisma.materialVersion.findMany()
   * ```
   */
  get materialVersion(): Prisma.MaterialVersionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends bigint
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: 'User';
    Profile: 'Profile';
    Club: 'Club';
    ClubMember: 'ClubMember';
    Event: 'Event';
    EventAttendee: 'EventAttendee';
    Listing: 'Listing';
    Message: 'Message';
    StudyMaterial: 'StudyMaterial';
    MaterialVersion: 'MaterialVersion';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'user'
        | 'profile'
        | 'club'
        | 'clubMember'
        | 'event'
        | 'eventAttendee'
        | 'listing'
        | 'message'
        | 'studyMaterial'
        | 'materialVersion';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>;
        fields: Prisma.ProfileFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[];
          };
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[];
          };
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[];
          };
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProfile>;
          };
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProfileGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>;
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number;
          };
        };
      };
      Club: {
        payload: Prisma.$ClubPayload<ExtArgs>;
        fields: Prisma.ClubFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ClubFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ClubFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>;
          };
          findFirst: {
            args: Prisma.ClubFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ClubFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>;
          };
          findMany: {
            args: Prisma.ClubFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>[];
          };
          create: {
            args: Prisma.ClubCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>;
          };
          createMany: {
            args: Prisma.ClubCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ClubCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>[];
          };
          delete: {
            args: Prisma.ClubDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>;
          };
          update: {
            args: Prisma.ClubUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>;
          };
          deleteMany: {
            args: Prisma.ClubDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ClubUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ClubUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>[];
          };
          upsert: {
            args: Prisma.ClubUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubPayload>;
          };
          aggregate: {
            args: Prisma.ClubAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateClub>;
          };
          groupBy: {
            args: Prisma.ClubGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ClubGroupByOutputType>[];
          };
          count: {
            args: Prisma.ClubCountArgs<ExtArgs>;
            result: $Utils.Optional<ClubCountAggregateOutputType> | number;
          };
        };
      };
      ClubMember: {
        payload: Prisma.$ClubMemberPayload<ExtArgs>;
        fields: Prisma.ClubMemberFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ClubMemberFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ClubMemberFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>;
          };
          findFirst: {
            args: Prisma.ClubMemberFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ClubMemberFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>;
          };
          findMany: {
            args: Prisma.ClubMemberFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>[];
          };
          create: {
            args: Prisma.ClubMemberCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>;
          };
          createMany: {
            args: Prisma.ClubMemberCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ClubMemberCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>[];
          };
          delete: {
            args: Prisma.ClubMemberDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>;
          };
          update: {
            args: Prisma.ClubMemberUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>;
          };
          deleteMany: {
            args: Prisma.ClubMemberDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ClubMemberUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ClubMemberUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>[];
          };
          upsert: {
            args: Prisma.ClubMemberUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ClubMemberPayload>;
          };
          aggregate: {
            args: Prisma.ClubMemberAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateClubMember>;
          };
          groupBy: {
            args: Prisma.ClubMemberGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ClubMemberGroupByOutputType>[];
          };
          count: {
            args: Prisma.ClubMemberCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<ClubMemberCountAggregateOutputType>
              | number;
          };
        };
      };
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>;
        fields: Prisma.EventFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[];
          };
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[];
          };
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[];
          };
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateEvent>;
          };
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>;
            result: $Utils.Optional<EventGroupByOutputType>[];
          };
          count: {
            args: Prisma.EventCountArgs<ExtArgs>;
            result: $Utils.Optional<EventCountAggregateOutputType> | number;
          };
        };
      };
      EventAttendee: {
        payload: Prisma.$EventAttendeePayload<ExtArgs>;
        fields: Prisma.EventAttendeeFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.EventAttendeeFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.EventAttendeeFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>;
          };
          findFirst: {
            args: Prisma.EventAttendeeFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.EventAttendeeFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>;
          };
          findMany: {
            args: Prisma.EventAttendeeFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>[];
          };
          create: {
            args: Prisma.EventAttendeeCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>;
          };
          createMany: {
            args: Prisma.EventAttendeeCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.EventAttendeeCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>[];
          };
          delete: {
            args: Prisma.EventAttendeeDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>;
          };
          update: {
            args: Prisma.EventAttendeeUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>;
          };
          deleteMany: {
            args: Prisma.EventAttendeeDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.EventAttendeeUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.EventAttendeeUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>[];
          };
          upsert: {
            args: Prisma.EventAttendeeUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>;
          };
          aggregate: {
            args: Prisma.EventAttendeeAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateEventAttendee>;
          };
          groupBy: {
            args: Prisma.EventAttendeeGroupByArgs<ExtArgs>;
            result: $Utils.Optional<EventAttendeeGroupByOutputType>[];
          };
          count: {
            args: Prisma.EventAttendeeCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<EventAttendeeCountAggregateOutputType>
              | number;
          };
        };
      };
      Listing: {
        payload: Prisma.$ListingPayload<ExtArgs>;
        fields: Prisma.ListingFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ListingFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>;
          };
          findFirst: {
            args: Prisma.ListingFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>;
          };
          findMany: {
            args: Prisma.ListingFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[];
          };
          create: {
            args: Prisma.ListingCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>;
          };
          createMany: {
            args: Prisma.ListingCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[];
          };
          delete: {
            args: Prisma.ListingDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>;
          };
          update: {
            args: Prisma.ListingUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>;
          };
          deleteMany: {
            args: Prisma.ListingDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ListingUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ListingUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[];
          };
          upsert: {
            args: Prisma.ListingUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>;
          };
          aggregate: {
            args: Prisma.ListingAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateListing>;
          };
          groupBy: {
            args: Prisma.ListingGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ListingGroupByOutputType>[];
          };
          count: {
            args: Prisma.ListingCountArgs<ExtArgs>;
            result: $Utils.Optional<ListingCountAggregateOutputType> | number;
          };
        };
      };
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>;
        fields: Prisma.MessageFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[];
          };
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[];
          };
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[];
          };
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMessage>;
          };
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MessageGroupByOutputType>[];
          };
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>;
            result: $Utils.Optional<MessageCountAggregateOutputType> | number;
          };
        };
      };
      StudyMaterial: {
        payload: Prisma.$StudyMaterialPayload<ExtArgs>;
        fields: Prisma.StudyMaterialFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.StudyMaterialFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.StudyMaterialFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>;
          };
          findFirst: {
            args: Prisma.StudyMaterialFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.StudyMaterialFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>;
          };
          findMany: {
            args: Prisma.StudyMaterialFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>[];
          };
          create: {
            args: Prisma.StudyMaterialCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>;
          };
          createMany: {
            args: Prisma.StudyMaterialCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.StudyMaterialCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>[];
          };
          delete: {
            args: Prisma.StudyMaterialDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>;
          };
          update: {
            args: Prisma.StudyMaterialUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>;
          };
          deleteMany: {
            args: Prisma.StudyMaterialDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.StudyMaterialUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.StudyMaterialUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>[];
          };
          upsert: {
            args: Prisma.StudyMaterialUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$StudyMaterialPayload>;
          };
          aggregate: {
            args: Prisma.StudyMaterialAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateStudyMaterial>;
          };
          groupBy: {
            args: Prisma.StudyMaterialGroupByArgs<ExtArgs>;
            result: $Utils.Optional<StudyMaterialGroupByOutputType>[];
          };
          count: {
            args: Prisma.StudyMaterialCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<StudyMaterialCountAggregateOutputType>
              | number;
          };
        };
      };
      MaterialVersion: {
        payload: Prisma.$MaterialVersionPayload<ExtArgs>;
        fields: Prisma.MaterialVersionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MaterialVersionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MaterialVersionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>;
          };
          findFirst: {
            args: Prisma.MaterialVersionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MaterialVersionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>;
          };
          findMany: {
            args: Prisma.MaterialVersionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>[];
          };
          create: {
            args: Prisma.MaterialVersionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>;
          };
          createMany: {
            args: Prisma.MaterialVersionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MaterialVersionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>[];
          };
          delete: {
            args: Prisma.MaterialVersionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>;
          };
          update: {
            args: Prisma.MaterialVersionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>;
          };
          deleteMany: {
            args: Prisma.MaterialVersionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MaterialVersionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MaterialVersionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>[];
          };
          upsert: {
            args: Prisma.MaterialVersionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaterialVersionPayload>;
          };
          aggregate: {
            args: Prisma.MaterialVersionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMaterialVersion>;
          };
          groupBy: {
            args: Prisma.MaterialVersionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MaterialVersionGroupByOutputType>[];
          };
          count: {
            args: Prisma.MaterialVersionCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<MaterialVersionCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    profile?: ProfileOmit;
    club?: ClubOmit;
    clubMember?: ClubMemberOmit;
    event?: EventOmit;
    eventAttendee?: EventAttendeeOmit;
    listing?: ListingOmit;
    message?: MessageOmit;
    studyMaterial?: StudyMaterialOmit;
    materialVersion?: MaterialVersionOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    clubMembers: number;
    eventAttendees: number;
    listings: number;
    messages: number;
    materials: number;
    materialVersions: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    clubMembers?: boolean | UserCountOutputTypeCountClubMembersArgs;
    eventAttendees?: boolean | UserCountOutputTypeCountEventAttendeesArgs;
    listings?: boolean | UserCountOutputTypeCountListingsArgs;
    messages?: boolean | UserCountOutputTypeCountMessagesArgs;
    materials?: boolean | UserCountOutputTypeCountMaterialsArgs;
    materialVersions?: boolean | UserCountOutputTypeCountMaterialVersionsArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountClubMembersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ClubMemberWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventAttendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventAttendeeWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountListingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ListingWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MessageWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMaterialsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: StudyMaterialWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMaterialVersionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MaterialVersionWhereInput;
  };

  /**
   * Count Type ClubCountOutputType
   */

  export type ClubCountOutputType = {
    members: number;
    events: number;
  };

  export type ClubCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    members?: boolean | ClubCountOutputTypeCountMembersArgs;
    events?: boolean | ClubCountOutputTypeCountEventsArgs;
  };

  // Custom InputTypes
  /**
   * ClubCountOutputType without action
   */
  export type ClubCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubCountOutputType
     */
    select?: ClubCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ClubCountOutputType without action
   */
  export type ClubCountOutputTypeCountMembersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ClubMemberWhereInput;
  };

  /**
   * ClubCountOutputType without action
   */
  export type ClubCountOutputTypeCountEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventWhereInput;
  };

  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    attendees: number;
  };

  export type EventCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendees?: boolean | EventCountOutputTypeCountAttendeesArgs;
  };

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountAttendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventAttendeeWhereInput;
  };

  /**
   * Count Type ListingCountOutputType
   */

  export type ListingCountOutputType = {
    messages: number;
  };

  export type ListingCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    messages?: boolean | ListingCountOutputTypeCountMessagesArgs;
  };

  // Custom InputTypes
  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ListingCountOutputType
     */
    select?: ListingCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountMessagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MessageWhereInput;
  };

  /**
   * Count Type StudyMaterialCountOutputType
   */

  export type StudyMaterialCountOutputType = {
    versions: number;
  };

  export type StudyMaterialCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    versions?: boolean | StudyMaterialCountOutputTypeCountVersionsArgs;
  };

  // Custom InputTypes
  /**
   * StudyMaterialCountOutputType without action
   */
  export type StudyMaterialCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterialCountOutputType
     */
    select?: StudyMaterialCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * StudyMaterialCountOutputType without action
   */
  export type StudyMaterialCountOutputTypeCountVersionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MaterialVersionWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
    role: $Enums.UserRole | null;
    verified: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
    role: $Enums.UserRole | null;
    verified: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    password: number;
    name: number;
    role: number;
    verified: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    role?: true;
    verified?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    role?: true;
    verified?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    role?: true;
    verified?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserWhereInput;
    orderBy?:
      | UserOrderByWithAggregationInput
      | UserOrderByWithAggregationInput[];
    by: UserScalarFieldEnum[] | UserScalarFieldEnum;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };

  export type UserGroupByOutputType = {
    id: string;
    email: string;
    password: string;
    name: string | null;
    role: $Enums.UserRole;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      name?: boolean;
      role?: boolean;
      verified?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      profile?: boolean | User$profileArgs<ExtArgs>;
      clubMembers?: boolean | User$clubMembersArgs<ExtArgs>;
      eventAttendees?: boolean | User$eventAttendeesArgs<ExtArgs>;
      listings?: boolean | User$listingsArgs<ExtArgs>;
      messages?: boolean | User$messagesArgs<ExtArgs>;
      materials?: boolean | User$materialsArgs<ExtArgs>;
      materialVersions?: boolean | User$materialVersionsArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      name?: boolean;
      role?: boolean;
      verified?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      name?: boolean;
      role?: boolean;
      verified?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    name?: boolean;
    role?: boolean;
    verified?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type UserOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'email'
    | 'password'
    | 'name'
    | 'role'
    | 'verified'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['user']
  >;
  export type UserInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | User$profileArgs<ExtArgs>;
    clubMembers?: boolean | User$clubMembersArgs<ExtArgs>;
    eventAttendees?: boolean | User$eventAttendeesArgs<ExtArgs>;
    listings?: boolean | User$listingsArgs<ExtArgs>;
    messages?: boolean | User$messagesArgs<ExtArgs>;
    materials?: boolean | User$materialsArgs<ExtArgs>;
    materialVersions?: boolean | User$materialVersionsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'User';
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs> | null;
      clubMembers: Prisma.$ClubMemberPayload<ExtArgs>[];
      eventAttendees: Prisma.$EventAttendeePayload<ExtArgs>[];
      listings: Prisma.$ListingPayload<ExtArgs>[];
      messages: Prisma.$MessagePayload<ExtArgs>[];
      materials: Prisma.$StudyMaterialPayload<ExtArgs>[];
      materialVersions: Prisma.$MaterialVersionPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: $Enums.UserRole;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
    $Result.GetResult<Prisma.$UserPayload, S>;

  type UserCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['User'];
      meta: { name: 'User' };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetUserGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    profile<T extends User$profileArgs<ExtArgs> = {}>(
      args?: Subset<T, User$profileArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    clubMembers<T extends User$clubMembersArgs<ExtArgs> = {}>(
      args?: Subset<T, User$clubMembersArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ClubMemberPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    eventAttendees<T extends User$eventAttendeesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$eventAttendeesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$EventAttendeePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    listings<T extends User$listingsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$listingsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ListingPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    messages<T extends User$messagesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$messagesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MessagePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    materials<T extends User$materialsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$materialsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$StudyMaterialPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    materialVersions<T extends User$materialVersionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$materialVersionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MaterialVersionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly email: FieldRef<'User', 'String'>;
    readonly password: FieldRef<'User', 'String'>;
    readonly name: FieldRef<'User', 'String'>;
    readonly role: FieldRef<'User', 'UserRole'>;
    readonly verified: FieldRef<'User', 'Boolean'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly updatedAt: FieldRef<'User', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User create
   */
  export type UserCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.profile
   */
  export type User$profileArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    where?: ProfileWhereInput;
  };

  /**
   * User.clubMembers
   */
  export type User$clubMembersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    where?: ClubMemberWhereInput;
    orderBy?:
      | ClubMemberOrderByWithRelationInput
      | ClubMemberOrderByWithRelationInput[];
    cursor?: ClubMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ClubMemberScalarFieldEnum | ClubMemberScalarFieldEnum[];
  };

  /**
   * User.eventAttendees
   */
  export type User$eventAttendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    where?: EventAttendeeWhereInput;
    orderBy?:
      | EventAttendeeOrderByWithRelationInput
      | EventAttendeeOrderByWithRelationInput[];
    cursor?: EventAttendeeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[];
  };

  /**
   * User.listings
   */
  export type User$listingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    where?: ListingWhereInput;
    orderBy?:
      | ListingOrderByWithRelationInput
      | ListingOrderByWithRelationInput[];
    cursor?: ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[];
  };

  /**
   * User.messages
   */
  export type User$messagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    where?: MessageWhereInput;
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    cursor?: MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * User.materials
   */
  export type User$materialsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    where?: StudyMaterialWhereInput;
    orderBy?:
      | StudyMaterialOrderByWithRelationInput
      | StudyMaterialOrderByWithRelationInput[];
    cursor?: StudyMaterialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: StudyMaterialScalarFieldEnum | StudyMaterialScalarFieldEnum[];
  };

  /**
   * User.materialVersions
   */
  export type User$materialVersionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    where?: MaterialVersionWhereInput;
    orderBy?:
      | MaterialVersionOrderByWithRelationInput
      | MaterialVersionOrderByWithRelationInput[];
    cursor?: MaterialVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | MaterialVersionScalarFieldEnum
      | MaterialVersionScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
  };

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null;
    _avg: ProfileAvgAggregateOutputType | null;
    _sum: ProfileSumAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
  };

  export type ProfileAvgAggregateOutputType = {
    year: number | null;
  };

  export type ProfileSumAggregateOutputType = {
    year: number | null;
  };

  export type ProfileMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    college: string | null;
    year: number | null;
    major: string | null;
    bio: string | null;
    avatar: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProfileMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    college: string | null;
    year: number | null;
    major: string | null;
    bio: string | null;
    avatar: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProfileCountAggregateOutputType = {
    id: number;
    userId: number;
    college: number;
    year: number;
    major: number;
    bio: number;
    avatar: number;
    social: number;
    interests: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ProfileAvgAggregateInputType = {
    year?: true;
  };

  export type ProfileSumAggregateInputType = {
    year?: true;
  };

  export type ProfileMinAggregateInputType = {
    id?: true;
    userId?: true;
    college?: true;
    year?: true;
    major?: true;
    bio?: true;
    avatar?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProfileMaxAggregateInputType = {
    id?: true;
    userId?: true;
    college?: true;
    year?: true;
    major?: true;
    bio?: true;
    avatar?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProfileCountAggregateInputType = {
    id?: true;
    userId?: true;
    college?: true;
    year?: true;
    major?: true;
    bio?: true;
    avatar?: true;
    social?: true;
    interests?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ProfileAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Profiles
     **/
    _count?: true | ProfileCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProfileAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProfileSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProfileMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProfileMaxAggregateInputType;
  };

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>;
  };

  export type ProfileGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProfileWhereInput;
    orderBy?:
      | ProfileOrderByWithAggregationInput
      | ProfileOrderByWithAggregationInput[];
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum;
    having?: ProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProfileCountAggregateInputType | true;
    _avg?: ProfileAvgAggregateInputType;
    _sum?: ProfileSumAggregateInputType;
    _min?: ProfileMinAggregateInputType;
    _max?: ProfileMaxAggregateInputType;
  };

  export type ProfileGroupByOutputType = {
    id: string;
    userId: string;
    college: string;
    year: number;
    major: string;
    bio: string | null;
    avatar: string | null;
    social: JsonValue | null;
    interests: string[];
    createdAt: Date;
    updatedAt: Date;
    _count: ProfileCountAggregateOutputType | null;
    _avg: ProfileAvgAggregateOutputType | null;
    _sum: ProfileSumAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
  };

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProfileGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProfileGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>;
        }
      >
    >;

  export type ProfileSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      college?: boolean;
      year?: boolean;
      major?: boolean;
      bio?: boolean;
      avatar?: boolean;
      social?: boolean;
      interests?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['profile']
  >;

  export type ProfileSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      college?: boolean;
      year?: boolean;
      major?: boolean;
      bio?: boolean;
      avatar?: boolean;
      social?: boolean;
      interests?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['profile']
  >;

  export type ProfileSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      college?: boolean;
      year?: boolean;
      major?: boolean;
      bio?: boolean;
      avatar?: boolean;
      social?: boolean;
      interests?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['profile']
  >;

  export type ProfileSelectScalar = {
    id?: boolean;
    userId?: boolean;
    college?: boolean;
    year?: boolean;
    major?: boolean;
    bio?: boolean;
    avatar?: boolean;
    social?: boolean;
    interests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ProfileOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'college'
    | 'year'
    | 'major'
    | 'bio'
    | 'avatar'
    | 'social'
    | 'interests'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['profile']
  >;
  export type ProfileInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type ProfileIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type ProfileIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $ProfilePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Profile';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        college: string;
        year: number;
        major: string;
        bio: string | null;
        avatar: string | null;
        social: Prisma.JsonValue | null;
        interests: string[];
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['profile']
    >;
    composites: {};
  };

  type ProfileGetPayload<
    S extends boolean | null | undefined | ProfileDefaultArgs,
  > = $Result.GetResult<Prisma.$ProfilePayload, S>;

  type ProfileCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProfileCountAggregateInputType | true;
  };

  export interface ProfileDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Profile'];
      meta: { name: 'Profile' };
    };
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(
      args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(
      args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     *
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProfileFindManyArgs>(
      args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     *
     */
    create<T extends ProfileCreateArgs>(
      args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProfileCreateManyArgs>(
      args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     *
     */
    delete<T extends ProfileDeleteArgs>(
      args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProfileUpdateArgs>(
      args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProfileDeleteManyArgs>(
      args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProfileUpdateManyArgs>(
      args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(
      args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
     **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProfileAggregateArgs>(
      args: Subset<T, ProfileAggregateArgs>,
    ): Prisma.PrismaPromise<GetProfileAggregateType<T>>;

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetProfileGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Profile model
     */
    readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<'Profile', 'String'>;
    readonly userId: FieldRef<'Profile', 'String'>;
    readonly college: FieldRef<'Profile', 'String'>;
    readonly year: FieldRef<'Profile', 'Int'>;
    readonly major: FieldRef<'Profile', 'String'>;
    readonly bio: FieldRef<'Profile', 'String'>;
    readonly avatar: FieldRef<'Profile', 'String'>;
    readonly social: FieldRef<'Profile', 'Json'>;
    readonly interests: FieldRef<'Profile', 'String[]'>;
    readonly createdAt: FieldRef<'Profile', 'DateTime'>;
    readonly updatedAt: FieldRef<'Profile', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[];
  };

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[];
  };

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[];
  };

  /**
   * Profile create
   */
  export type ProfileCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>;
  };

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>;
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>;
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput;
    /**
     * Limit how many Profiles to update.
     */
    limit?: number;
  };

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>;
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput;
    /**
     * Limit how many Profiles to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput;
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>;
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>;
  };

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput;
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number;
  };

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
  };

  /**
   * Model Club
   */

  export type AggregateClub = {
    _count: ClubCountAggregateOutputType | null;
    _min: ClubMinAggregateOutputType | null;
    _max: ClubMaxAggregateOutputType | null;
  };

  export type ClubMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    cover: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ClubMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    cover: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ClubCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    cover: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ClubMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    cover?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ClubMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    cover?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ClubCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    cover?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ClubAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Club to aggregate.
     */
    where?: ClubWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Clubs to fetch.
     */
    orderBy?: ClubOrderByWithRelationInput | ClubOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ClubWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Clubs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Clubs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Clubs
     **/
    _count?: true | ClubCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ClubMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ClubMaxAggregateInputType;
  };

  export type GetClubAggregateType<T extends ClubAggregateArgs> = {
    [P in keyof T & keyof AggregateClub]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClub[P]>
      : GetScalarType<T[P], AggregateClub[P]>;
  };

  export type ClubGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ClubWhereInput;
    orderBy?:
      | ClubOrderByWithAggregationInput
      | ClubOrderByWithAggregationInput[];
    by: ClubScalarFieldEnum[] | ClubScalarFieldEnum;
    having?: ClubScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClubCountAggregateInputType | true;
    _min?: ClubMinAggregateInputType;
    _max?: ClubMaxAggregateInputType;
  };

  export type ClubGroupByOutputType = {
    id: string;
    name: string;
    description: string;
    cover: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ClubCountAggregateOutputType | null;
    _min: ClubMinAggregateOutputType | null;
    _max: ClubMaxAggregateOutputType | null;
  };

  type GetClubGroupByPayload<T extends ClubGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClubGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ClubGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ClubGroupByOutputType[P]>
          : GetScalarType<T[P], ClubGroupByOutputType[P]>;
      }
    >
  >;

  export type ClubSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      cover?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      members?: boolean | Club$membersArgs<ExtArgs>;
      events?: boolean | Club$eventsArgs<ExtArgs>;
      _count?: boolean | ClubCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['club']
  >;

  export type ClubSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      cover?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['club']
  >;

  export type ClubSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      cover?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['club']
  >;

  export type ClubSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    cover?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ClubOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'name' | 'description' | 'cover' | 'createdAt' | 'updatedAt',
    ExtArgs['result']['club']
  >;
  export type ClubInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    members?: boolean | Club$membersArgs<ExtArgs>;
    events?: boolean | Club$eventsArgs<ExtArgs>;
    _count?: boolean | ClubCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type ClubIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type ClubIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $ClubPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Club';
    objects: {
      members: Prisma.$ClubMemberPayload<ExtArgs>[];
      events: Prisma.$EventPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        description: string;
        cover: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['club']
    >;
    composites: {};
  };

  type ClubGetPayload<S extends boolean | null | undefined | ClubDefaultArgs> =
    $Result.GetResult<Prisma.$ClubPayload, S>;

  type ClubCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ClubFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClubCountAggregateInputType | true;
  };

  export interface ClubDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Club'];
      meta: { name: 'Club' };
    };
    /**
     * Find zero or one Club that matches the filter.
     * @param {ClubFindUniqueArgs} args - Arguments to find a Club
     * @example
     * // Get one Club
     * const club = await prisma.club.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClubFindUniqueArgs>(
      args: SelectSubset<T, ClubFindUniqueArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Club that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClubFindUniqueOrThrowArgs} args - Arguments to find a Club
     * @example
     * // Get one Club
     * const club = await prisma.club.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClubFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ClubFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Club that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubFindFirstArgs} args - Arguments to find a Club
     * @example
     * // Get one Club
     * const club = await prisma.club.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClubFindFirstArgs>(
      args?: SelectSubset<T, ClubFindFirstArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Club that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubFindFirstOrThrowArgs} args - Arguments to find a Club
     * @example
     * // Get one Club
     * const club = await prisma.club.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClubFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ClubFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Clubs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clubs
     * const clubs = await prisma.club.findMany()
     *
     * // Get first 10 Clubs
     * const clubs = await prisma.club.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const clubWithIdOnly = await prisma.club.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ClubFindManyArgs>(
      args?: SelectSubset<T, ClubFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Club.
     * @param {ClubCreateArgs} args - Arguments to create a Club.
     * @example
     * // Create one Club
     * const Club = await prisma.club.create({
     *   data: {
     *     // ... data to create a Club
     *   }
     * })
     *
     */
    create<T extends ClubCreateArgs>(
      args: SelectSubset<T, ClubCreateArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Clubs.
     * @param {ClubCreateManyArgs} args - Arguments to create many Clubs.
     * @example
     * // Create many Clubs
     * const club = await prisma.club.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ClubCreateManyArgs>(
      args?: SelectSubset<T, ClubCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Clubs and returns the data saved in the database.
     * @param {ClubCreateManyAndReturnArgs} args - Arguments to create many Clubs.
     * @example
     * // Create many Clubs
     * const club = await prisma.club.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Clubs and only return the `id`
     * const clubWithIdOnly = await prisma.club.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ClubCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ClubCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Club.
     * @param {ClubDeleteArgs} args - Arguments to delete one Club.
     * @example
     * // Delete one Club
     * const Club = await prisma.club.delete({
     *   where: {
     *     // ... filter to delete one Club
     *   }
     * })
     *
     */
    delete<T extends ClubDeleteArgs>(
      args: SelectSubset<T, ClubDeleteArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Club.
     * @param {ClubUpdateArgs} args - Arguments to update one Club.
     * @example
     * // Update one Club
     * const club = await prisma.club.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ClubUpdateArgs>(
      args: SelectSubset<T, ClubUpdateArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Clubs.
     * @param {ClubDeleteManyArgs} args - Arguments to filter Clubs to delete.
     * @example
     * // Delete a few Clubs
     * const { count } = await prisma.club.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ClubDeleteManyArgs>(
      args?: SelectSubset<T, ClubDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Clubs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clubs
     * const club = await prisma.club.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ClubUpdateManyArgs>(
      args: SelectSubset<T, ClubUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Clubs and returns the data updated in the database.
     * @param {ClubUpdateManyAndReturnArgs} args - Arguments to update many Clubs.
     * @example
     * // Update many Clubs
     * const club = await prisma.club.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Clubs and only return the `id`
     * const clubWithIdOnly = await prisma.club.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ClubUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ClubUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Club.
     * @param {ClubUpsertArgs} args - Arguments to update or create a Club.
     * @example
     * // Update or create a Club
     * const club = await prisma.club.upsert({
     *   create: {
     *     // ... data to create a Club
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Club we want to update
     *   }
     * })
     */
    upsert<T extends ClubUpsertArgs>(
      args: SelectSubset<T, ClubUpsertArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Clubs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubCountArgs} args - Arguments to filter Clubs to count.
     * @example
     * // Count the number of Clubs
     * const count = await prisma.club.count({
     *   where: {
     *     // ... the filter for the Clubs we want to count
     *   }
     * })
     **/
    count<T extends ClubCountArgs>(
      args?: Subset<T, ClubCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Club.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ClubAggregateArgs>(
      args: Subset<T, ClubAggregateArgs>,
    ): Prisma.PrismaPromise<GetClubAggregateType<T>>;

    /**
     * Group by Club.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ClubGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClubGroupByArgs['orderBy'] }
        : { orderBy?: ClubGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ClubGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetClubGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Club model
     */
    readonly fields: ClubFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Club.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClubClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    members<T extends Club$membersArgs<ExtArgs> = {}>(
      args?: Subset<T, Club$membersArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ClubMemberPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    events<T extends Club$eventsArgs<ExtArgs> = {}>(
      args?: Subset<T, Club$eventsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$EventPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Club model
   */
  interface ClubFieldRefs {
    readonly id: FieldRef<'Club', 'String'>;
    readonly name: FieldRef<'Club', 'String'>;
    readonly description: FieldRef<'Club', 'String'>;
    readonly cover: FieldRef<'Club', 'String'>;
    readonly createdAt: FieldRef<'Club', 'DateTime'>;
    readonly updatedAt: FieldRef<'Club', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Club findUnique
   */
  export type ClubFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * Filter, which Club to fetch.
     */
    where: ClubWhereUniqueInput;
  };

  /**
   * Club findUniqueOrThrow
   */
  export type ClubFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * Filter, which Club to fetch.
     */
    where: ClubWhereUniqueInput;
  };

  /**
   * Club findFirst
   */
  export type ClubFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * Filter, which Club to fetch.
     */
    where?: ClubWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Clubs to fetch.
     */
    orderBy?: ClubOrderByWithRelationInput | ClubOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Clubs.
     */
    cursor?: ClubWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Clubs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Clubs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Clubs.
     */
    distinct?: ClubScalarFieldEnum | ClubScalarFieldEnum[];
  };

  /**
   * Club findFirstOrThrow
   */
  export type ClubFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * Filter, which Club to fetch.
     */
    where?: ClubWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Clubs to fetch.
     */
    orderBy?: ClubOrderByWithRelationInput | ClubOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Clubs.
     */
    cursor?: ClubWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Clubs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Clubs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Clubs.
     */
    distinct?: ClubScalarFieldEnum | ClubScalarFieldEnum[];
  };

  /**
   * Club findMany
   */
  export type ClubFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * Filter, which Clubs to fetch.
     */
    where?: ClubWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Clubs to fetch.
     */
    orderBy?: ClubOrderByWithRelationInput | ClubOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Clubs.
     */
    cursor?: ClubWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Clubs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Clubs.
     */
    skip?: number;
    distinct?: ClubScalarFieldEnum | ClubScalarFieldEnum[];
  };

  /**
   * Club create
   */
  export type ClubCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * The data needed to create a Club.
     */
    data: XOR<ClubCreateInput, ClubUncheckedCreateInput>;
  };

  /**
   * Club createMany
   */
  export type ClubCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Clubs.
     */
    data: ClubCreateManyInput | ClubCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Club createManyAndReturn
   */
  export type ClubCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * The data used to create many Clubs.
     */
    data: ClubCreateManyInput | ClubCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Club update
   */
  export type ClubUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * The data needed to update a Club.
     */
    data: XOR<ClubUpdateInput, ClubUncheckedUpdateInput>;
    /**
     * Choose, which Club to update.
     */
    where: ClubWhereUniqueInput;
  };

  /**
   * Club updateMany
   */
  export type ClubUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Clubs.
     */
    data: XOR<ClubUpdateManyMutationInput, ClubUncheckedUpdateManyInput>;
    /**
     * Filter which Clubs to update
     */
    where?: ClubWhereInput;
    /**
     * Limit how many Clubs to update.
     */
    limit?: number;
  };

  /**
   * Club updateManyAndReturn
   */
  export type ClubUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * The data used to update Clubs.
     */
    data: XOR<ClubUpdateManyMutationInput, ClubUncheckedUpdateManyInput>;
    /**
     * Filter which Clubs to update
     */
    where?: ClubWhereInput;
    /**
     * Limit how many Clubs to update.
     */
    limit?: number;
  };

  /**
   * Club upsert
   */
  export type ClubUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * The filter to search for the Club to update in case it exists.
     */
    where: ClubWhereUniqueInput;
    /**
     * In case the Club found by the `where` argument doesn't exist, create a new Club with this data.
     */
    create: XOR<ClubCreateInput, ClubUncheckedCreateInput>;
    /**
     * In case the Club was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClubUpdateInput, ClubUncheckedUpdateInput>;
  };

  /**
   * Club delete
   */
  export type ClubDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    /**
     * Filter which Club to delete.
     */
    where: ClubWhereUniqueInput;
  };

  /**
   * Club deleteMany
   */
  export type ClubDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Clubs to delete
     */
    where?: ClubWhereInput;
    /**
     * Limit how many Clubs to delete.
     */
    limit?: number;
  };

  /**
   * Club.members
   */
  export type Club$membersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    where?: ClubMemberWhereInput;
    orderBy?:
      | ClubMemberOrderByWithRelationInput
      | ClubMemberOrderByWithRelationInput[];
    cursor?: ClubMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ClubMemberScalarFieldEnum | ClubMemberScalarFieldEnum[];
  };

  /**
   * Club.events
   */
  export type Club$eventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    where?: EventWhereInput;
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    cursor?: EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Club without action
   */
  export type ClubDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
  };

  /**
   * Model ClubMember
   */

  export type AggregateClubMember = {
    _count: ClubMemberCountAggregateOutputType | null;
    _min: ClubMemberMinAggregateOutputType | null;
    _max: ClubMemberMaxAggregateOutputType | null;
  };

  export type ClubMemberMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    clubId: string | null;
    role: $Enums.ClubRole | null;
    joinedAt: Date | null;
  };

  export type ClubMemberMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    clubId: string | null;
    role: $Enums.ClubRole | null;
    joinedAt: Date | null;
  };

  export type ClubMemberCountAggregateOutputType = {
    id: number;
    userId: number;
    clubId: number;
    role: number;
    joinedAt: number;
    _all: number;
  };

  export type ClubMemberMinAggregateInputType = {
    id?: true;
    userId?: true;
    clubId?: true;
    role?: true;
    joinedAt?: true;
  };

  export type ClubMemberMaxAggregateInputType = {
    id?: true;
    userId?: true;
    clubId?: true;
    role?: true;
    joinedAt?: true;
  };

  export type ClubMemberCountAggregateInputType = {
    id?: true;
    userId?: true;
    clubId?: true;
    role?: true;
    joinedAt?: true;
    _all?: true;
  };

  export type ClubMemberAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ClubMember to aggregate.
     */
    where?: ClubMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClubMembers to fetch.
     */
    orderBy?:
      | ClubMemberOrderByWithRelationInput
      | ClubMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ClubMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClubMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClubMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ClubMembers
     **/
    _count?: true | ClubMemberCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ClubMemberMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ClubMemberMaxAggregateInputType;
  };

  export type GetClubMemberAggregateType<T extends ClubMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateClubMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClubMember[P]>
      : GetScalarType<T[P], AggregateClubMember[P]>;
  };

  export type ClubMemberGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ClubMemberWhereInput;
    orderBy?:
      | ClubMemberOrderByWithAggregationInput
      | ClubMemberOrderByWithAggregationInput[];
    by: ClubMemberScalarFieldEnum[] | ClubMemberScalarFieldEnum;
    having?: ClubMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClubMemberCountAggregateInputType | true;
    _min?: ClubMemberMinAggregateInputType;
    _max?: ClubMemberMaxAggregateInputType;
  };

  export type ClubMemberGroupByOutputType = {
    id: string;
    userId: string;
    clubId: string;
    role: $Enums.ClubRole;
    joinedAt: Date;
    _count: ClubMemberCountAggregateOutputType | null;
    _min: ClubMemberMinAggregateOutputType | null;
    _max: ClubMemberMaxAggregateOutputType | null;
  };

  type GetClubMemberGroupByPayload<T extends ClubMemberGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ClubMemberGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ClubMemberGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClubMemberGroupByOutputType[P]>
            : GetScalarType<T[P], ClubMemberGroupByOutputType[P]>;
        }
      >
    >;

  export type ClubMemberSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      clubId?: boolean;
      role?: boolean;
      joinedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      club?: boolean | ClubDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['clubMember']
  >;

  export type ClubMemberSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      clubId?: boolean;
      role?: boolean;
      joinedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      club?: boolean | ClubDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['clubMember']
  >;

  export type ClubMemberSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      clubId?: boolean;
      role?: boolean;
      joinedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      club?: boolean | ClubDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['clubMember']
  >;

  export type ClubMemberSelectScalar = {
    id?: boolean;
    userId?: boolean;
    clubId?: boolean;
    role?: boolean;
    joinedAt?: boolean;
  };

  export type ClubMemberOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'userId' | 'clubId' | 'role' | 'joinedAt',
    ExtArgs['result']['clubMember']
  >;
  export type ClubMemberInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    club?: boolean | ClubDefaultArgs<ExtArgs>;
  };
  export type ClubMemberIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    club?: boolean | ClubDefaultArgs<ExtArgs>;
  };
  export type ClubMemberIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    club?: boolean | ClubDefaultArgs<ExtArgs>;
  };

  export type $ClubMemberPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ClubMember';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      club: Prisma.$ClubPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        clubId: string;
        role: $Enums.ClubRole;
        joinedAt: Date;
      },
      ExtArgs['result']['clubMember']
    >;
    composites: {};
  };

  type ClubMemberGetPayload<
    S extends boolean | null | undefined | ClubMemberDefaultArgs,
  > = $Result.GetResult<Prisma.$ClubMemberPayload, S>;

  type ClubMemberCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    ClubMemberFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: ClubMemberCountAggregateInputType | true;
  };

  export interface ClubMemberDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ClubMember'];
      meta: { name: 'ClubMember' };
    };
    /**
     * Find zero or one ClubMember that matches the filter.
     * @param {ClubMemberFindUniqueArgs} args - Arguments to find a ClubMember
     * @example
     * // Get one ClubMember
     * const clubMember = await prisma.clubMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClubMemberFindUniqueArgs>(
      args: SelectSubset<T, ClubMemberFindUniqueArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one ClubMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClubMemberFindUniqueOrThrowArgs} args - Arguments to find a ClubMember
     * @example
     * // Get one ClubMember
     * const clubMember = await prisma.clubMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClubMemberFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ClubMemberFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ClubMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberFindFirstArgs} args - Arguments to find a ClubMember
     * @example
     * // Get one ClubMember
     * const clubMember = await prisma.clubMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClubMemberFindFirstArgs>(
      args?: SelectSubset<T, ClubMemberFindFirstArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ClubMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberFindFirstOrThrowArgs} args - Arguments to find a ClubMember
     * @example
     * // Get one ClubMember
     * const clubMember = await prisma.clubMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClubMemberFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ClubMemberFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more ClubMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClubMembers
     * const clubMembers = await prisma.clubMember.findMany()
     *
     * // Get first 10 ClubMembers
     * const clubMembers = await prisma.clubMember.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const clubMemberWithIdOnly = await prisma.clubMember.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ClubMemberFindManyArgs>(
      args?: SelectSubset<T, ClubMemberFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a ClubMember.
     * @param {ClubMemberCreateArgs} args - Arguments to create a ClubMember.
     * @example
     * // Create one ClubMember
     * const ClubMember = await prisma.clubMember.create({
     *   data: {
     *     // ... data to create a ClubMember
     *   }
     * })
     *
     */
    create<T extends ClubMemberCreateArgs>(
      args: SelectSubset<T, ClubMemberCreateArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many ClubMembers.
     * @param {ClubMemberCreateManyArgs} args - Arguments to create many ClubMembers.
     * @example
     * // Create many ClubMembers
     * const clubMember = await prisma.clubMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ClubMemberCreateManyArgs>(
      args?: SelectSubset<T, ClubMemberCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ClubMembers and returns the data saved in the database.
     * @param {ClubMemberCreateManyAndReturnArgs} args - Arguments to create many ClubMembers.
     * @example
     * // Create many ClubMembers
     * const clubMember = await prisma.clubMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ClubMembers and only return the `id`
     * const clubMemberWithIdOnly = await prisma.clubMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ClubMemberCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ClubMemberCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a ClubMember.
     * @param {ClubMemberDeleteArgs} args - Arguments to delete one ClubMember.
     * @example
     * // Delete one ClubMember
     * const ClubMember = await prisma.clubMember.delete({
     *   where: {
     *     // ... filter to delete one ClubMember
     *   }
     * })
     *
     */
    delete<T extends ClubMemberDeleteArgs>(
      args: SelectSubset<T, ClubMemberDeleteArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one ClubMember.
     * @param {ClubMemberUpdateArgs} args - Arguments to update one ClubMember.
     * @example
     * // Update one ClubMember
     * const clubMember = await prisma.clubMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ClubMemberUpdateArgs>(
      args: SelectSubset<T, ClubMemberUpdateArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more ClubMembers.
     * @param {ClubMemberDeleteManyArgs} args - Arguments to filter ClubMembers to delete.
     * @example
     * // Delete a few ClubMembers
     * const { count } = await prisma.clubMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ClubMemberDeleteManyArgs>(
      args?: SelectSubset<T, ClubMemberDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ClubMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClubMembers
     * const clubMember = await prisma.clubMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ClubMemberUpdateManyArgs>(
      args: SelectSubset<T, ClubMemberUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ClubMembers and returns the data updated in the database.
     * @param {ClubMemberUpdateManyAndReturnArgs} args - Arguments to update many ClubMembers.
     * @example
     * // Update many ClubMembers
     * const clubMember = await prisma.clubMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ClubMembers and only return the `id`
     * const clubMemberWithIdOnly = await prisma.clubMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ClubMemberUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ClubMemberUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one ClubMember.
     * @param {ClubMemberUpsertArgs} args - Arguments to update or create a ClubMember.
     * @example
     * // Update or create a ClubMember
     * const clubMember = await prisma.clubMember.upsert({
     *   create: {
     *     // ... data to create a ClubMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClubMember we want to update
     *   }
     * })
     */
    upsert<T extends ClubMemberUpsertArgs>(
      args: SelectSubset<T, ClubMemberUpsertArgs<ExtArgs>>,
    ): Prisma__ClubMemberClient<
      $Result.GetResult<
        Prisma.$ClubMemberPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of ClubMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberCountArgs} args - Arguments to filter ClubMembers to count.
     * @example
     * // Count the number of ClubMembers
     * const count = await prisma.clubMember.count({
     *   where: {
     *     // ... the filter for the ClubMembers we want to count
     *   }
     * })
     **/
    count<T extends ClubMemberCountArgs>(
      args?: Subset<T, ClubMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubMemberCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ClubMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ClubMemberAggregateArgs>(
      args: Subset<T, ClubMemberAggregateArgs>,
    ): Prisma.PrismaPromise<GetClubMemberAggregateType<T>>;

    /**
     * Group by ClubMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ClubMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClubMemberGroupByArgs['orderBy'] }
        : { orderBy?: ClubMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ClubMemberGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetClubMemberGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ClubMember model
     */
    readonly fields: ClubMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClubMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClubMemberClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    club<T extends ClubDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ClubDefaultArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      | $Result.GetResult<
          Prisma.$ClubPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ClubMember model
   */
  interface ClubMemberFieldRefs {
    readonly id: FieldRef<'ClubMember', 'String'>;
    readonly userId: FieldRef<'ClubMember', 'String'>;
    readonly clubId: FieldRef<'ClubMember', 'String'>;
    readonly role: FieldRef<'ClubMember', 'ClubRole'>;
    readonly joinedAt: FieldRef<'ClubMember', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * ClubMember findUnique
   */
  export type ClubMemberFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * Filter, which ClubMember to fetch.
     */
    where: ClubMemberWhereUniqueInput;
  };

  /**
   * ClubMember findUniqueOrThrow
   */
  export type ClubMemberFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * Filter, which ClubMember to fetch.
     */
    where: ClubMemberWhereUniqueInput;
  };

  /**
   * ClubMember findFirst
   */
  export type ClubMemberFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * Filter, which ClubMember to fetch.
     */
    where?: ClubMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClubMembers to fetch.
     */
    orderBy?:
      | ClubMemberOrderByWithRelationInput
      | ClubMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ClubMembers.
     */
    cursor?: ClubMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClubMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClubMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClubMembers.
     */
    distinct?: ClubMemberScalarFieldEnum | ClubMemberScalarFieldEnum[];
  };

  /**
   * ClubMember findFirstOrThrow
   */
  export type ClubMemberFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * Filter, which ClubMember to fetch.
     */
    where?: ClubMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClubMembers to fetch.
     */
    orderBy?:
      | ClubMemberOrderByWithRelationInput
      | ClubMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ClubMembers.
     */
    cursor?: ClubMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClubMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClubMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClubMembers.
     */
    distinct?: ClubMemberScalarFieldEnum | ClubMemberScalarFieldEnum[];
  };

  /**
   * ClubMember findMany
   */
  export type ClubMemberFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * Filter, which ClubMembers to fetch.
     */
    where?: ClubMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClubMembers to fetch.
     */
    orderBy?:
      | ClubMemberOrderByWithRelationInput
      | ClubMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ClubMembers.
     */
    cursor?: ClubMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClubMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClubMembers.
     */
    skip?: number;
    distinct?: ClubMemberScalarFieldEnum | ClubMemberScalarFieldEnum[];
  };

  /**
   * ClubMember create
   */
  export type ClubMemberCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * The data needed to create a ClubMember.
     */
    data: XOR<ClubMemberCreateInput, ClubMemberUncheckedCreateInput>;
  };

  /**
   * ClubMember createMany
   */
  export type ClubMemberCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ClubMembers.
     */
    data: ClubMemberCreateManyInput | ClubMemberCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ClubMember createManyAndReturn
   */
  export type ClubMemberCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * The data used to create many ClubMembers.
     */
    data: ClubMemberCreateManyInput | ClubMemberCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ClubMember update
   */
  export type ClubMemberUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * The data needed to update a ClubMember.
     */
    data: XOR<ClubMemberUpdateInput, ClubMemberUncheckedUpdateInput>;
    /**
     * Choose, which ClubMember to update.
     */
    where: ClubMemberWhereUniqueInput;
  };

  /**
   * ClubMember updateMany
   */
  export type ClubMemberUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ClubMembers.
     */
    data: XOR<
      ClubMemberUpdateManyMutationInput,
      ClubMemberUncheckedUpdateManyInput
    >;
    /**
     * Filter which ClubMembers to update
     */
    where?: ClubMemberWhereInput;
    /**
     * Limit how many ClubMembers to update.
     */
    limit?: number;
  };

  /**
   * ClubMember updateManyAndReturn
   */
  export type ClubMemberUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * The data used to update ClubMembers.
     */
    data: XOR<
      ClubMemberUpdateManyMutationInput,
      ClubMemberUncheckedUpdateManyInput
    >;
    /**
     * Filter which ClubMembers to update
     */
    where?: ClubMemberWhereInput;
    /**
     * Limit how many ClubMembers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ClubMember upsert
   */
  export type ClubMemberUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * The filter to search for the ClubMember to update in case it exists.
     */
    where: ClubMemberWhereUniqueInput;
    /**
     * In case the ClubMember found by the `where` argument doesn't exist, create a new ClubMember with this data.
     */
    create: XOR<ClubMemberCreateInput, ClubMemberUncheckedCreateInput>;
    /**
     * In case the ClubMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClubMemberUpdateInput, ClubMemberUncheckedUpdateInput>;
  };

  /**
   * ClubMember delete
   */
  export type ClubMemberDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
    /**
     * Filter which ClubMember to delete.
     */
    where: ClubMemberWhereUniqueInput;
  };

  /**
   * ClubMember deleteMany
   */
  export type ClubMemberDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ClubMembers to delete
     */
    where?: ClubMemberWhereInput;
    /**
     * Limit how many ClubMembers to delete.
     */
    limit?: number;
  };

  /**
   * ClubMember without action
   */
  export type ClubMemberDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ClubMember
     */
    select?: ClubMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClubMember
     */
    omit?: ClubMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubMemberInclude<ExtArgs> | null;
  };

  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
  };

  export type EventMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    startDate: Date | null;
    endDate: Date | null;
    location: string | null;
    clubId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type EventMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    startDate: Date | null;
    endDate: Date | null;
    location: string | null;
    clubId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type EventCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    startDate: number;
    endDate: number;
    location: number;
    clubId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type EventMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    startDate?: true;
    endDate?: true;
    location?: true;
    clubId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type EventMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    startDate?: true;
    endDate?: true;
    location?: true;
    clubId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type EventCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    startDate?: true;
    endDate?: true;
    location?: true;
    clubId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type EventAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Events
     **/
    _count?: true | EventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventMaxAggregateInputType;
  };

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
    [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>;
  };

  export type EventGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventWhereInput;
    orderBy?:
      | EventOrderByWithAggregationInput
      | EventOrderByWithAggregationInput[];
    by: EventScalarFieldEnum[] | EventScalarFieldEnum;
    having?: EventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventCountAggregateInputType | true;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
  };

  export type EventGroupByOutputType = {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string | null;
    clubId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: EventCountAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
  };

  type GetEventGroupByPayload<T extends EventGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<EventGroupByOutputType, T['by']> & {
          [P in keyof T & keyof EventGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>;
        }
      >
    >;

  export type EventSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      location?: boolean;
      clubId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      club?: boolean | Event$clubArgs<ExtArgs>;
      attendees?: boolean | Event$attendeesArgs<ExtArgs>;
      _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['event']
  >;

  export type EventSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      location?: boolean;
      clubId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      club?: boolean | Event$clubArgs<ExtArgs>;
    },
    ExtArgs['result']['event']
  >;

  export type EventSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      location?: boolean;
      clubId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      club?: boolean | Event$clubArgs<ExtArgs>;
    },
    ExtArgs['result']['event']
  >;

  export type EventSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    location?: boolean;
    clubId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type EventOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'title'
    | 'description'
    | 'startDate'
    | 'endDate'
    | 'location'
    | 'clubId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['event']
  >;
  export type EventInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    club?: boolean | Event$clubArgs<ExtArgs>;
    attendees?: boolean | Event$attendeesArgs<ExtArgs>;
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type EventIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    club?: boolean | Event$clubArgs<ExtArgs>;
  };
  export type EventIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    club?: boolean | Event$clubArgs<ExtArgs>;
  };

  export type $EventPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Event';
    objects: {
      club: Prisma.$ClubPayload<ExtArgs> | null;
      attendees: Prisma.$EventAttendeePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        title: string;
        description: string;
        startDate: Date;
        endDate: Date;
        location: string | null;
        clubId: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['event']
    >;
    composites: {};
  };

  type EventGetPayload<
    S extends boolean | null | undefined | EventDefaultArgs,
  > = $Result.GetResult<Prisma.$EventPayload, S>;

  type EventCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventCountAggregateInputType | true;
  };

  export interface EventDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Event'];
      meta: { name: 'Event' };
    };
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(
      args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(
      args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     *
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EventFindManyArgs>(
      args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     *
     */
    create<T extends EventCreateArgs>(
      args: SelectSubset<T, EventCreateArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EventCreateManyArgs>(
      args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     *
     */
    delete<T extends EventDeleteArgs>(
      args: SelectSubset<T, EventDeleteArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EventUpdateArgs>(
      args: SelectSubset<T, EventUpdateArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EventDeleteManyArgs>(
      args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EventUpdateManyArgs>(
      args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(
      args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(
      args: SelectSubset<T, EventUpsertArgs<ExtArgs>>,
    ): Prisma__EventClient<
      $Result.GetResult<
        Prisma.$EventPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
     **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventAggregateArgs>(
      args: Subset<T, EventAggregateArgs>,
    ): Prisma.PrismaPromise<GetEventAggregateType<T>>;

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetEventGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Event model
     */
    readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    club<T extends Event$clubArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$clubArgs<ExtArgs>>,
    ): Prisma__ClubClient<
      $Result.GetResult<
        Prisma.$ClubPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    attendees<T extends Event$attendeesArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$attendeesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$EventAttendeePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<'Event', 'String'>;
    readonly title: FieldRef<'Event', 'String'>;
    readonly description: FieldRef<'Event', 'String'>;
    readonly startDate: FieldRef<'Event', 'DateTime'>;
    readonly endDate: FieldRef<'Event', 'DateTime'>;
    readonly location: FieldRef<'Event', 'String'>;
    readonly clubId: FieldRef<'Event', 'String'>;
    readonly createdAt: FieldRef<'Event', 'DateTime'>;
    readonly updatedAt: FieldRef<'Event', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Event findMany
   */
  export type EventFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Event create
   */
  export type EventCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>;
  };

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Event update
   */
  export type EventUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>;
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>;
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput;
    /**
     * Limit how many Events to update.
     */
    limit?: number;
  };

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>;
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput;
    /**
     * Limit how many Events to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Event upsert
   */
  export type EventUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput;
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>;
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>;
  };

  /**
   * Event delete
   */
  export type EventDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput;
    /**
     * Limit how many Events to delete.
     */
    limit?: number;
  };

  /**
   * Event.club
   */
  export type Event$clubArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Club
     */
    select?: ClubSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Club
     */
    omit?: ClubOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubInclude<ExtArgs> | null;
    where?: ClubWhereInput;
  };

  /**
   * Event.attendees
   */
  export type Event$attendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    where?: EventAttendeeWhereInput;
    orderBy?:
      | EventAttendeeOrderByWithRelationInput
      | EventAttendeeOrderByWithRelationInput[];
    cursor?: EventAttendeeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[];
  };

  /**
   * Event without action
   */
  export type EventDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
  };

  /**
   * Model EventAttendee
   */

  export type AggregateEventAttendee = {
    _count: EventAttendeeCountAggregateOutputType | null;
    _min: EventAttendeeMinAggregateOutputType | null;
    _max: EventAttendeeMaxAggregateOutputType | null;
  };

  export type EventAttendeeMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    status: $Enums.RSVPStatus | null;
  };

  export type EventAttendeeMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    status: $Enums.RSVPStatus | null;
  };

  export type EventAttendeeCountAggregateOutputType = {
    id: number;
    userId: number;
    eventId: number;
    status: number;
    _all: number;
  };

  export type EventAttendeeMinAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    status?: true;
  };

  export type EventAttendeeMaxAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    status?: true;
  };

  export type EventAttendeeCountAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    status?: true;
    _all?: true;
  };

  export type EventAttendeeAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EventAttendee to aggregate.
     */
    where?: EventAttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?:
      | EventAttendeeOrderByWithRelationInput
      | EventAttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EventAttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventAttendees
     **/
    _count?: true | EventAttendeeCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventAttendeeMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventAttendeeMaxAggregateInputType;
  };

  export type GetEventAttendeeAggregateType<
    T extends EventAttendeeAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateEventAttendee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventAttendee[P]>
      : GetScalarType<T[P], AggregateEventAttendee[P]>;
  };

  export type EventAttendeeGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventAttendeeWhereInput;
    orderBy?:
      | EventAttendeeOrderByWithAggregationInput
      | EventAttendeeOrderByWithAggregationInput[];
    by: EventAttendeeScalarFieldEnum[] | EventAttendeeScalarFieldEnum;
    having?: EventAttendeeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventAttendeeCountAggregateInputType | true;
    _min?: EventAttendeeMinAggregateInputType;
    _max?: EventAttendeeMaxAggregateInputType;
  };

  export type EventAttendeeGroupByOutputType = {
    id: string;
    userId: string;
    eventId: string;
    status: $Enums.RSVPStatus;
    _count: EventAttendeeCountAggregateOutputType | null;
    _min: EventAttendeeMinAggregateOutputType | null;
    _max: EventAttendeeMaxAggregateOutputType | null;
  };

  type GetEventAttendeeGroupByPayload<T extends EventAttendeeGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<EventAttendeeGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof EventAttendeeGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventAttendeeGroupByOutputType[P]>
            : GetScalarType<T[P], EventAttendeeGroupByOutputType[P]>;
        }
      >
    >;

  export type EventAttendeeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      eventId?: boolean;
      status?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['eventAttendee']
  >;

  export type EventAttendeeSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      eventId?: boolean;
      status?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['eventAttendee']
  >;

  export type EventAttendeeSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      eventId?: boolean;
      status?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['eventAttendee']
  >;

  export type EventAttendeeSelectScalar = {
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    status?: boolean;
  };

  export type EventAttendeeOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'userId' | 'eventId' | 'status',
    ExtArgs['result']['eventAttendee']
  >;
  export type EventAttendeeInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };
  export type EventAttendeeIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };
  export type EventAttendeeIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };

  export type $EventAttendeePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'EventAttendee';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        eventId: string;
        status: $Enums.RSVPStatus;
      },
      ExtArgs['result']['eventAttendee']
    >;
    composites: {};
  };

  type EventAttendeeGetPayload<
    S extends boolean | null | undefined | EventAttendeeDefaultArgs,
  > = $Result.GetResult<Prisma.$EventAttendeePayload, S>;

  type EventAttendeeCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    EventAttendeeFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: EventAttendeeCountAggregateInputType | true;
  };

  export interface EventAttendeeDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['EventAttendee'];
      meta: { name: 'EventAttendee' };
    };
    /**
     * Find zero or one EventAttendee that matches the filter.
     * @param {EventAttendeeFindUniqueArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventAttendeeFindUniqueArgs>(
      args: SelectSubset<T, EventAttendeeFindUniqueArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one EventAttendee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventAttendeeFindUniqueOrThrowArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventAttendeeFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EventAttendeeFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first EventAttendee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeFindFirstArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventAttendeeFindFirstArgs>(
      args?: SelectSubset<T, EventAttendeeFindFirstArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first EventAttendee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeFindFirstOrThrowArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventAttendeeFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventAttendeeFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more EventAttendees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventAttendees
     * const eventAttendees = await prisma.eventAttendee.findMany()
     *
     * // Get first 10 EventAttendees
     * const eventAttendees = await prisma.eventAttendee.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventAttendeeWithIdOnly = await prisma.eventAttendee.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EventAttendeeFindManyArgs>(
      args?: SelectSubset<T, EventAttendeeFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a EventAttendee.
     * @param {EventAttendeeCreateArgs} args - Arguments to create a EventAttendee.
     * @example
     * // Create one EventAttendee
     * const EventAttendee = await prisma.eventAttendee.create({
     *   data: {
     *     // ... data to create a EventAttendee
     *   }
     * })
     *
     */
    create<T extends EventAttendeeCreateArgs>(
      args: SelectSubset<T, EventAttendeeCreateArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many EventAttendees.
     * @param {EventAttendeeCreateManyArgs} args - Arguments to create many EventAttendees.
     * @example
     * // Create many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EventAttendeeCreateManyArgs>(
      args?: SelectSubset<T, EventAttendeeCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many EventAttendees and returns the data saved in the database.
     * @param {EventAttendeeCreateManyAndReturnArgs} args - Arguments to create many EventAttendees.
     * @example
     * // Create many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many EventAttendees and only return the `id`
     * const eventAttendeeWithIdOnly = await prisma.eventAttendee.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EventAttendeeCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EventAttendeeCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a EventAttendee.
     * @param {EventAttendeeDeleteArgs} args - Arguments to delete one EventAttendee.
     * @example
     * // Delete one EventAttendee
     * const EventAttendee = await prisma.eventAttendee.delete({
     *   where: {
     *     // ... filter to delete one EventAttendee
     *   }
     * })
     *
     */
    delete<T extends EventAttendeeDeleteArgs>(
      args: SelectSubset<T, EventAttendeeDeleteArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one EventAttendee.
     * @param {EventAttendeeUpdateArgs} args - Arguments to update one EventAttendee.
     * @example
     * // Update one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EventAttendeeUpdateArgs>(
      args: SelectSubset<T, EventAttendeeUpdateArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more EventAttendees.
     * @param {EventAttendeeDeleteManyArgs} args - Arguments to filter EventAttendees to delete.
     * @example
     * // Delete a few EventAttendees
     * const { count } = await prisma.eventAttendee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EventAttendeeDeleteManyArgs>(
      args?: SelectSubset<T, EventAttendeeDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventAttendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EventAttendeeUpdateManyArgs>(
      args: SelectSubset<T, EventAttendeeUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventAttendees and returns the data updated in the database.
     * @param {EventAttendeeUpdateManyAndReturnArgs} args - Arguments to update many EventAttendees.
     * @example
     * // Update many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more EventAttendees and only return the `id`
     * const eventAttendeeWithIdOnly = await prisma.eventAttendee.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends EventAttendeeUpdateManyAndReturnArgs>(
      args: SelectSubset<T, EventAttendeeUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one EventAttendee.
     * @param {EventAttendeeUpsertArgs} args - Arguments to update or create a EventAttendee.
     * @example
     * // Update or create a EventAttendee
     * const eventAttendee = await prisma.eventAttendee.upsert({
     *   create: {
     *     // ... data to create a EventAttendee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventAttendee we want to update
     *   }
     * })
     */
    upsert<T extends EventAttendeeUpsertArgs>(
      args: SelectSubset<T, EventAttendeeUpsertArgs<ExtArgs>>,
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of EventAttendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeCountArgs} args - Arguments to filter EventAttendees to count.
     * @example
     * // Count the number of EventAttendees
     * const count = await prisma.eventAttendee.count({
     *   where: {
     *     // ... the filter for the EventAttendees we want to count
     *   }
     * })
     **/
    count<T extends EventAttendeeCountArgs>(
      args?: Subset<T, EventAttendeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventAttendeeCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EventAttendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventAttendeeAggregateArgs>(
      args: Subset<T, EventAttendeeAggregateArgs>,
    ): Prisma.PrismaPromise<GetEventAttendeeAggregateType<T>>;

    /**
     * Group by EventAttendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventAttendeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventAttendeeGroupByArgs['orderBy'] }
        : { orderBy?: EventAttendeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, EventAttendeeGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetEventAttendeeGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the EventAttendee model
     */
    readonly fields: EventAttendeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventAttendee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventAttendeeClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>,
    ): Prisma__EventClient<
      | $Result.GetResult<
          Prisma.$EventPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the EventAttendee model
   */
  interface EventAttendeeFieldRefs {
    readonly id: FieldRef<'EventAttendee', 'String'>;
    readonly userId: FieldRef<'EventAttendee', 'String'>;
    readonly eventId: FieldRef<'EventAttendee', 'String'>;
    readonly status: FieldRef<'EventAttendee', 'RSVPStatus'>;
  }

  // Custom InputTypes
  /**
   * EventAttendee findUnique
   */
  export type EventAttendeeFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which EventAttendee to fetch.
     */
    where: EventAttendeeWhereUniqueInput;
  };

  /**
   * EventAttendee findUniqueOrThrow
   */
  export type EventAttendeeFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which EventAttendee to fetch.
     */
    where: EventAttendeeWhereUniqueInput;
  };

  /**
   * EventAttendee findFirst
   */
  export type EventAttendeeFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which EventAttendee to fetch.
     */
    where?: EventAttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?:
      | EventAttendeeOrderByWithRelationInput
      | EventAttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventAttendees.
     */
    cursor?: EventAttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventAttendees.
     */
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[];
  };

  /**
   * EventAttendee findFirstOrThrow
   */
  export type EventAttendeeFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which EventAttendee to fetch.
     */
    where?: EventAttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?:
      | EventAttendeeOrderByWithRelationInput
      | EventAttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventAttendees.
     */
    cursor?: EventAttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventAttendees.
     */
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[];
  };

  /**
   * EventAttendee findMany
   */
  export type EventAttendeeFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which EventAttendees to fetch.
     */
    where?: EventAttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?:
      | EventAttendeeOrderByWithRelationInput
      | EventAttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventAttendees.
     */
    cursor?: EventAttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number;
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[];
  };

  /**
   * EventAttendee create
   */
  export type EventAttendeeCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * The data needed to create a EventAttendee.
     */
    data: XOR<EventAttendeeCreateInput, EventAttendeeUncheckedCreateInput>;
  };

  /**
   * EventAttendee createMany
   */
  export type EventAttendeeCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many EventAttendees.
     */
    data: EventAttendeeCreateManyInput | EventAttendeeCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * EventAttendee createManyAndReturn
   */
  export type EventAttendeeCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * The data used to create many EventAttendees.
     */
    data: EventAttendeeCreateManyInput | EventAttendeeCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * EventAttendee update
   */
  export type EventAttendeeUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * The data needed to update a EventAttendee.
     */
    data: XOR<EventAttendeeUpdateInput, EventAttendeeUncheckedUpdateInput>;
    /**
     * Choose, which EventAttendee to update.
     */
    where: EventAttendeeWhereUniqueInput;
  };

  /**
   * EventAttendee updateMany
   */
  export type EventAttendeeUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update EventAttendees.
     */
    data: XOR<
      EventAttendeeUpdateManyMutationInput,
      EventAttendeeUncheckedUpdateManyInput
    >;
    /**
     * Filter which EventAttendees to update
     */
    where?: EventAttendeeWhereInput;
    /**
     * Limit how many EventAttendees to update.
     */
    limit?: number;
  };

  /**
   * EventAttendee updateManyAndReturn
   */
  export type EventAttendeeUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * The data used to update EventAttendees.
     */
    data: XOR<
      EventAttendeeUpdateManyMutationInput,
      EventAttendeeUncheckedUpdateManyInput
    >;
    /**
     * Filter which EventAttendees to update
     */
    where?: EventAttendeeWhereInput;
    /**
     * Limit how many EventAttendees to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * EventAttendee upsert
   */
  export type EventAttendeeUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * The filter to search for the EventAttendee to update in case it exists.
     */
    where: EventAttendeeWhereUniqueInput;
    /**
     * In case the EventAttendee found by the `where` argument doesn't exist, create a new EventAttendee with this data.
     */
    create: XOR<EventAttendeeCreateInput, EventAttendeeUncheckedCreateInput>;
    /**
     * In case the EventAttendee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventAttendeeUpdateInput, EventAttendeeUncheckedUpdateInput>;
  };

  /**
   * EventAttendee delete
   */
  export type EventAttendeeDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
    /**
     * Filter which EventAttendee to delete.
     */
    where: EventAttendeeWhereUniqueInput;
  };

  /**
   * EventAttendee deleteMany
   */
  export type EventAttendeeDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EventAttendees to delete
     */
    where?: EventAttendeeWhereInput;
    /**
     * Limit how many EventAttendees to delete.
     */
    limit?: number;
  };

  /**
   * EventAttendee without action
   */
  export type EventAttendeeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null;
  };

  /**
   * Model Listing
   */

  export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null;
    _avg: ListingAvgAggregateOutputType | null;
    _sum: ListingSumAggregateOutputType | null;
    _min: ListingMinAggregateOutputType | null;
    _max: ListingMaxAggregateOutputType | null;
  };

  export type ListingAvgAggregateOutputType = {
    price: number | null;
  };

  export type ListingSumAggregateOutputType = {
    price: number | null;
  };

  export type ListingMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    price: number | null;
    condition: $Enums.Condition | null;
    category: $Enums.Category | null;
    sellerId: string | null;
    status: $Enums.ListingStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ListingMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    price: number | null;
    condition: $Enums.Condition | null;
    category: $Enums.Category | null;
    sellerId: string | null;
    status: $Enums.ListingStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ListingCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    price: number;
    condition: number;
    category: number;
    images: number;
    sellerId: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ListingAvgAggregateInputType = {
    price?: true;
  };

  export type ListingSumAggregateInputType = {
    price?: true;
  };

  export type ListingMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    price?: true;
    condition?: true;
    category?: true;
    sellerId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ListingMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    price?: true;
    condition?: true;
    category?: true;
    sellerId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ListingCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    price?: true;
    condition?: true;
    category?: true;
    images?: true;
    sellerId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ListingAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Listing to aggregate.
     */
    where?: ListingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Listings to fetch.
     */
    orderBy?:
      | ListingOrderByWithRelationInput
      | ListingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ListingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Listings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Listings
     **/
    _count?: true | ListingCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ListingAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ListingSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ListingMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ListingMaxAggregateInputType;
  };

  export type GetListingAggregateType<T extends ListingAggregateArgs> = {
    [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListing[P]>
      : GetScalarType<T[P], AggregateListing[P]>;
  };

  export type ListingGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ListingWhereInput;
    orderBy?:
      | ListingOrderByWithAggregationInput
      | ListingOrderByWithAggregationInput[];
    by: ListingScalarFieldEnum[] | ListingScalarFieldEnum;
    having?: ListingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListingCountAggregateInputType | true;
    _avg?: ListingAvgAggregateInputType;
    _sum?: ListingSumAggregateInputType;
    _min?: ListingMinAggregateInputType;
    _max?: ListingMaxAggregateInputType;
  };

  export type ListingGroupByOutputType = {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images: string[];
    sellerId: string;
    status: $Enums.ListingStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: ListingCountAggregateOutputType | null;
    _avg: ListingAvgAggregateOutputType | null;
    _sum: ListingSumAggregateOutputType | null;
    _min: ListingMinAggregateOutputType | null;
    _max: ListingMaxAggregateOutputType | null;
  };

  type GetListingGroupByPayload<T extends ListingGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ListingGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ListingGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingGroupByOutputType[P]>
            : GetScalarType<T[P], ListingGroupByOutputType[P]>;
        }
      >
    >;

  export type ListingSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      price?: boolean;
      condition?: boolean;
      category?: boolean;
      images?: boolean;
      sellerId?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      seller?: boolean | UserDefaultArgs<ExtArgs>;
      messages?: boolean | Listing$messagesArgs<ExtArgs>;
      _count?: boolean | ListingCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['listing']
  >;

  export type ListingSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      price?: boolean;
      condition?: boolean;
      category?: boolean;
      images?: boolean;
      sellerId?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      seller?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['listing']
  >;

  export type ListingSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      price?: boolean;
      condition?: boolean;
      category?: boolean;
      images?: boolean;
      sellerId?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      seller?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['listing']
  >;

  export type ListingSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    price?: boolean;
    condition?: boolean;
    category?: boolean;
    images?: boolean;
    sellerId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ListingOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'title'
    | 'description'
    | 'price'
    | 'condition'
    | 'category'
    | 'images'
    | 'sellerId'
    | 'status'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['listing']
  >;
  export type ListingInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    seller?: boolean | UserDefaultArgs<ExtArgs>;
    messages?: boolean | Listing$messagesArgs<ExtArgs>;
    _count?: boolean | ListingCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type ListingIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    seller?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type ListingIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    seller?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $ListingPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Listing';
    objects: {
      seller: Prisma.$UserPayload<ExtArgs>;
      messages: Prisma.$MessagePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        title: string;
        description: string;
        price: number;
        condition: $Enums.Condition;
        category: $Enums.Category;
        images: string[];
        sellerId: string;
        status: $Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['listing']
    >;
    composites: {};
  };

  type ListingGetPayload<
    S extends boolean | null | undefined | ListingDefaultArgs,
  > = $Result.GetResult<Prisma.$ListingPayload, S>;

  type ListingCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListingCountAggregateInputType | true;
  };

  export interface ListingDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Listing'];
      meta: { name: 'Listing' };
    };
    /**
     * Find zero or one Listing that matches the filter.
     * @param {ListingFindUniqueArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListingFindUniqueArgs>(
      args: SelectSubset<T, ListingFindUniqueArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Listing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ListingFindUniqueOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListingFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ListingFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Listing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListingFindFirstArgs>(
      args?: SelectSubset<T, ListingFindFirstArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Listing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListingFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ListingFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Listings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Listings
     * const listings = await prisma.listing.findMany()
     *
     * // Get first 10 Listings
     * const listings = await prisma.listing.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const listingWithIdOnly = await prisma.listing.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ListingFindManyArgs>(
      args?: SelectSubset<T, ListingFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Listing.
     * @param {ListingCreateArgs} args - Arguments to create a Listing.
     * @example
     * // Create one Listing
     * const Listing = await prisma.listing.create({
     *   data: {
     *     // ... data to create a Listing
     *   }
     * })
     *
     */
    create<T extends ListingCreateArgs>(
      args: SelectSubset<T, ListingCreateArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Listings.
     * @param {ListingCreateManyArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ListingCreateManyArgs>(
      args?: SelectSubset<T, ListingCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Listings and returns the data saved in the database.
     * @param {ListingCreateManyAndReturnArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ListingCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ListingCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Listing.
     * @param {ListingDeleteArgs} args - Arguments to delete one Listing.
     * @example
     * // Delete one Listing
     * const Listing = await prisma.listing.delete({
     *   where: {
     *     // ... filter to delete one Listing
     *   }
     * })
     *
     */
    delete<T extends ListingDeleteArgs>(
      args: SelectSubset<T, ListingDeleteArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Listing.
     * @param {ListingUpdateArgs} args - Arguments to update one Listing.
     * @example
     * // Update one Listing
     * const listing = await prisma.listing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ListingUpdateArgs>(
      args: SelectSubset<T, ListingUpdateArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Listings.
     * @param {ListingDeleteManyArgs} args - Arguments to filter Listings to delete.
     * @example
     * // Delete a few Listings
     * const { count } = await prisma.listing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ListingDeleteManyArgs>(
      args?: SelectSubset<T, ListingDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ListingUpdateManyArgs>(
      args: SelectSubset<T, ListingUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Listings and returns the data updated in the database.
     * @param {ListingUpdateManyAndReturnArgs} args - Arguments to update many Listings.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ListingUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ListingUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Listing.
     * @param {ListingUpsertArgs} args - Arguments to update or create a Listing.
     * @example
     * // Update or create a Listing
     * const listing = await prisma.listing.upsert({
     *   create: {
     *     // ... data to create a Listing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Listing we want to update
     *   }
     * })
     */
    upsert<T extends ListingUpsertArgs>(
      args: SelectSubset<T, ListingUpsertArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      $Result.GetResult<
        Prisma.$ListingPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingCountArgs} args - Arguments to filter Listings to count.
     * @example
     * // Count the number of Listings
     * const count = await prisma.listing.count({
     *   where: {
     *     // ... the filter for the Listings we want to count
     *   }
     * })
     **/
    count<T extends ListingCountArgs>(
      args?: Subset<T, ListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ListingAggregateArgs>(
      args: Subset<T, ListingAggregateArgs>,
    ): Prisma.PrismaPromise<GetListingAggregateType<T>>;

    /**
     * Group by Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingGroupByArgs['orderBy'] }
        : { orderBy?: ListingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetListingGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Listing model
     */
    readonly fields: ListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Listing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListingClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    messages<T extends Listing$messagesArgs<ExtArgs> = {}>(
      args?: Subset<T, Listing$messagesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MessagePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Listing model
   */
  interface ListingFieldRefs {
    readonly id: FieldRef<'Listing', 'String'>;
    readonly title: FieldRef<'Listing', 'String'>;
    readonly description: FieldRef<'Listing', 'String'>;
    readonly price: FieldRef<'Listing', 'Float'>;
    readonly condition: FieldRef<'Listing', 'Condition'>;
    readonly category: FieldRef<'Listing', 'Category'>;
    readonly images: FieldRef<'Listing', 'String[]'>;
    readonly sellerId: FieldRef<'Listing', 'String'>;
    readonly status: FieldRef<'Listing', 'ListingStatus'>;
    readonly createdAt: FieldRef<'Listing', 'DateTime'>;
    readonly updatedAt: FieldRef<'Listing', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Listing findUnique
   */
  export type ListingFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput;
  };

  /**
   * Listing findUniqueOrThrow
   */
  export type ListingFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput;
  };

  /**
   * Listing findFirst
   */
  export type ListingFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Listings to fetch.
     */
    orderBy?:
      | ListingOrderByWithRelationInput
      | ListingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Listings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[];
  };

  /**
   * Listing findFirstOrThrow
   */
  export type ListingFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Listings to fetch.
     */
    orderBy?:
      | ListingOrderByWithRelationInput
      | ListingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Listings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[];
  };

  /**
   * Listing findMany
   */
  export type ListingFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * Filter, which Listings to fetch.
     */
    where?: ListingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Listings to fetch.
     */
    orderBy?:
      | ListingOrderByWithRelationInput
      | ListingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Listings.
     */
    cursor?: ListingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Listings.
     */
    skip?: number;
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[];
  };

  /**
   * Listing create
   */
  export type ListingCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * The data needed to create a Listing.
     */
    data: XOR<ListingCreateInput, ListingUncheckedCreateInput>;
  };

  /**
   * Listing createMany
   */
  export type ListingCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Listing createManyAndReturn
   */
  export type ListingCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Listing update
   */
  export type ListingUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * The data needed to update a Listing.
     */
    data: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>;
    /**
     * Choose, which Listing to update.
     */
    where: ListingWhereUniqueInput;
  };

  /**
   * Listing updateMany
   */
  export type ListingUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>;
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput;
    /**
     * Limit how many Listings to update.
     */
    limit?: number;
  };

  /**
   * Listing updateManyAndReturn
   */
  export type ListingUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>;
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput;
    /**
     * Limit how many Listings to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Listing upsert
   */
  export type ListingUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * The filter to search for the Listing to update in case it exists.
     */
    where: ListingWhereUniqueInput;
    /**
     * In case the Listing found by the `where` argument doesn't exist, create a new Listing with this data.
     */
    create: XOR<ListingCreateInput, ListingUncheckedCreateInput>;
    /**
     * In case the Listing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>;
  };

  /**
   * Listing delete
   */
  export type ListingDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
    /**
     * Filter which Listing to delete.
     */
    where: ListingWhereUniqueInput;
  };

  /**
   * Listing deleteMany
   */
  export type ListingDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Listings to delete
     */
    where?: ListingWhereInput;
    /**
     * Limit how many Listings to delete.
     */
    limit?: number;
  };

  /**
   * Listing.messages
   */
  export type Listing$messagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    where?: MessageWhereInput;
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    cursor?: MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Listing without action
   */
  export type ListingDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null;
  };

  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null;
    _min: MessageMinAggregateOutputType | null;
    _max: MessageMaxAggregateOutputType | null;
  };

  export type MessageMinAggregateOutputType = {
    id: string | null;
    content: string | null;
    senderId: string | null;
    listingId: string | null;
    createdAt: Date | null;
  };

  export type MessageMaxAggregateOutputType = {
    id: string | null;
    content: string | null;
    senderId: string | null;
    listingId: string | null;
    createdAt: Date | null;
  };

  export type MessageCountAggregateOutputType = {
    id: number;
    content: number;
    senderId: number;
    listingId: number;
    createdAt: number;
    _all: number;
  };

  export type MessageMinAggregateInputType = {
    id?: true;
    content?: true;
    senderId?: true;
    listingId?: true;
    createdAt?: true;
  };

  export type MessageMaxAggregateInputType = {
    id?: true;
    content?: true;
    senderId?: true;
    listingId?: true;
    createdAt?: true;
  };

  export type MessageCountAggregateInputType = {
    id?: true;
    content?: true;
    senderId?: true;
    listingId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type MessageAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Messages
     **/
    _count?: true | MessageCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: MessageMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: MessageMaxAggregateInputType;
  };

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
    [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>;
  };

  export type MessageGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MessageWhereInput;
    orderBy?:
      | MessageOrderByWithAggregationInput
      | MessageOrderByWithAggregationInput[];
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum;
    having?: MessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MessageCountAggregateInputType | true;
    _min?: MessageMinAggregateInputType;
    _max?: MessageMaxAggregateInputType;
  };

  export type MessageGroupByOutputType = {
    id: string;
    content: string;
    senderId: string;
    listingId: string;
    createdAt: Date;
    _count: MessageCountAggregateOutputType | null;
    _min: MessageMinAggregateOutputType | null;
    _max: MessageMaxAggregateOutputType | null;
  };

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<MessageGroupByOutputType, T['by']> & {
          [P in keyof T & keyof MessageGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>;
        }
      >
    >;

  export type MessageSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      senderId?: boolean;
      listingId?: boolean;
      createdAt?: boolean;
      sender?: boolean | UserDefaultArgs<ExtArgs>;
      listing?: boolean | ListingDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['message']
  >;

  export type MessageSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      senderId?: boolean;
      listingId?: boolean;
      createdAt?: boolean;
      sender?: boolean | UserDefaultArgs<ExtArgs>;
      listing?: boolean | ListingDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['message']
  >;

  export type MessageSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      senderId?: boolean;
      listingId?: boolean;
      createdAt?: boolean;
      sender?: boolean | UserDefaultArgs<ExtArgs>;
      listing?: boolean | ListingDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['message']
  >;

  export type MessageSelectScalar = {
    id?: boolean;
    content?: boolean;
    senderId?: boolean;
    listingId?: boolean;
    createdAt?: boolean;
  };

  export type MessageOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'content' | 'senderId' | 'listingId' | 'createdAt',
    ExtArgs['result']['message']
  >;
  export type MessageInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sender?: boolean | UserDefaultArgs<ExtArgs>;
    listing?: boolean | ListingDefaultArgs<ExtArgs>;
  };
  export type MessageIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sender?: boolean | UserDefaultArgs<ExtArgs>;
    listing?: boolean | ListingDefaultArgs<ExtArgs>;
  };
  export type MessageIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sender?: boolean | UserDefaultArgs<ExtArgs>;
    listing?: boolean | ListingDefaultArgs<ExtArgs>;
  };

  export type $MessagePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Message';
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>;
      listing: Prisma.$ListingPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        content: string;
        senderId: string;
        listingId: string;
        createdAt: Date;
      },
      ExtArgs['result']['message']
    >;
    composites: {};
  };

  type MessageGetPayload<
    S extends boolean | null | undefined | MessageDefaultArgs,
  > = $Result.GetResult<Prisma.$MessagePayload, S>;

  type MessageCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MessageCountAggregateInputType | true;
  };

  export interface MessageDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Message'];
      meta: { name: 'Message' };
    };
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(
      args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(
      args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     *
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MessageFindManyArgs>(
      args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     *
     */
    create<T extends MessageCreateArgs>(
      args: SelectSubset<T, MessageCreateArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MessageCreateManyArgs>(
      args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     *
     */
    delete<T extends MessageDeleteArgs>(
      args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MessageUpdateArgs>(
      args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MessageDeleteManyArgs>(
      args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MessageUpdateManyArgs>(
      args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(
      args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
     **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends MessageAggregateArgs>(
      args: Subset<T, MessageAggregateArgs>,
    ): Prisma.PrismaPromise<GetMessageAggregateType<T>>;

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetMessageGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Message model
     */
    readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    listing<T extends ListingDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ListingDefaultArgs<ExtArgs>>,
    ): Prisma__ListingClient<
      | $Result.GetResult<
          Prisma.$ListingPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<'Message', 'String'>;
    readonly content: FieldRef<'Message', 'String'>;
    readonly senderId: FieldRef<'Message', 'String'>;
    readonly listingId: FieldRef<'Message', 'String'>;
    readonly createdAt: FieldRef<'Message', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Message create
   */
  export type MessageCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>;
  };

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Message update
   */
  export type MessageUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>;
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>;
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput;
    /**
     * Limit how many Messages to update.
     */
    limit?: number;
  };

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>;
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput;
    /**
     * Limit how many Messages to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput;
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>;
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>;
  };

  /**
   * Message delete
   */
  export type MessageDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput;
    /**
     * Limit how many Messages to delete.
     */
    limit?: number;
  };

  /**
   * Message without action
   */
  export type MessageDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
  };

  /**
   * Model StudyMaterial
   */

  export type AggregateStudyMaterial = {
    _count: StudyMaterialCountAggregateOutputType | null;
    _min: StudyMaterialMinAggregateOutputType | null;
    _max: StudyMaterialMaxAggregateOutputType | null;
  };

  export type StudyMaterialMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    subject: string | null;
    type: $Enums.MaterialType | null;
    file: string | null;
    uploaderId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type StudyMaterialMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    subject: string | null;
    type: $Enums.MaterialType | null;
    file: string | null;
    uploaderId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type StudyMaterialCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    subject: number;
    type: number;
    file: number;
    uploaderId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type StudyMaterialMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    subject?: true;
    type?: true;
    file?: true;
    uploaderId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type StudyMaterialMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    subject?: true;
    type?: true;
    file?: true;
    uploaderId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type StudyMaterialCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    subject?: true;
    type?: true;
    file?: true;
    uploaderId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type StudyMaterialAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which StudyMaterial to aggregate.
     */
    where?: StudyMaterialWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StudyMaterials to fetch.
     */
    orderBy?:
      | StudyMaterialOrderByWithRelationInput
      | StudyMaterialOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: StudyMaterialWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StudyMaterials from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StudyMaterials.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned StudyMaterials
     **/
    _count?: true | StudyMaterialCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: StudyMaterialMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: StudyMaterialMaxAggregateInputType;
  };

  export type GetStudyMaterialAggregateType<
    T extends StudyMaterialAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateStudyMaterial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudyMaterial[P]>
      : GetScalarType<T[P], AggregateStudyMaterial[P]>;
  };

  export type StudyMaterialGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: StudyMaterialWhereInput;
    orderBy?:
      | StudyMaterialOrderByWithAggregationInput
      | StudyMaterialOrderByWithAggregationInput[];
    by: StudyMaterialScalarFieldEnum[] | StudyMaterialScalarFieldEnum;
    having?: StudyMaterialScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StudyMaterialCountAggregateInputType | true;
    _min?: StudyMaterialMinAggregateInputType;
    _max?: StudyMaterialMaxAggregateInputType;
  };

  export type StudyMaterialGroupByOutputType = {
    id: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    uploaderId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: StudyMaterialCountAggregateOutputType | null;
    _min: StudyMaterialMinAggregateOutputType | null;
    _max: StudyMaterialMaxAggregateOutputType | null;
  };

  type GetStudyMaterialGroupByPayload<T extends StudyMaterialGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<StudyMaterialGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof StudyMaterialGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudyMaterialGroupByOutputType[P]>
            : GetScalarType<T[P], StudyMaterialGroupByOutputType[P]>;
        }
      >
    >;

  export type StudyMaterialSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      subject?: boolean;
      type?: boolean;
      file?: boolean;
      uploaderId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      versions?: boolean | StudyMaterial$versionsArgs<ExtArgs>;
      uploader?: boolean | UserDefaultArgs<ExtArgs>;
      _count?: boolean | StudyMaterialCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['studyMaterial']
  >;

  export type StudyMaterialSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      subject?: boolean;
      type?: boolean;
      file?: boolean;
      uploaderId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      uploader?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['studyMaterial']
  >;

  export type StudyMaterialSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      subject?: boolean;
      type?: boolean;
      file?: boolean;
      uploaderId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      uploader?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['studyMaterial']
  >;

  export type StudyMaterialSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    subject?: boolean;
    type?: boolean;
    file?: boolean;
    uploaderId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type StudyMaterialOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'title'
    | 'description'
    | 'subject'
    | 'type'
    | 'file'
    | 'uploaderId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['studyMaterial']
  >;
  export type StudyMaterialInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    versions?: boolean | StudyMaterial$versionsArgs<ExtArgs>;
    uploader?: boolean | UserDefaultArgs<ExtArgs>;
    _count?: boolean | StudyMaterialCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type StudyMaterialIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type StudyMaterialIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $StudyMaterialPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'StudyMaterial';
    objects: {
      versions: Prisma.$MaterialVersionPayload<ExtArgs>[];
      uploader: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        title: string;
        description: string;
        subject: string;
        type: $Enums.MaterialType;
        file: string;
        uploaderId: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['studyMaterial']
    >;
    composites: {};
  };

  type StudyMaterialGetPayload<
    S extends boolean | null | undefined | StudyMaterialDefaultArgs,
  > = $Result.GetResult<Prisma.$StudyMaterialPayload, S>;

  type StudyMaterialCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    StudyMaterialFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: StudyMaterialCountAggregateInputType | true;
  };

  export interface StudyMaterialDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['StudyMaterial'];
      meta: { name: 'StudyMaterial' };
    };
    /**
     * Find zero or one StudyMaterial that matches the filter.
     * @param {StudyMaterialFindUniqueArgs} args - Arguments to find a StudyMaterial
     * @example
     * // Get one StudyMaterial
     * const studyMaterial = await prisma.studyMaterial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudyMaterialFindUniqueArgs>(
      args: SelectSubset<T, StudyMaterialFindUniqueArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one StudyMaterial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudyMaterialFindUniqueOrThrowArgs} args - Arguments to find a StudyMaterial
     * @example
     * // Get one StudyMaterial
     * const studyMaterial = await prisma.studyMaterial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudyMaterialFindUniqueOrThrowArgs>(
      args: SelectSubset<T, StudyMaterialFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first StudyMaterial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialFindFirstArgs} args - Arguments to find a StudyMaterial
     * @example
     * // Get one StudyMaterial
     * const studyMaterial = await prisma.studyMaterial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudyMaterialFindFirstArgs>(
      args?: SelectSubset<T, StudyMaterialFindFirstArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first StudyMaterial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialFindFirstOrThrowArgs} args - Arguments to find a StudyMaterial
     * @example
     * // Get one StudyMaterial
     * const studyMaterial = await prisma.studyMaterial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudyMaterialFindFirstOrThrowArgs>(
      args?: SelectSubset<T, StudyMaterialFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more StudyMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudyMaterials
     * const studyMaterials = await prisma.studyMaterial.findMany()
     *
     * // Get first 10 StudyMaterials
     * const studyMaterials = await prisma.studyMaterial.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const studyMaterialWithIdOnly = await prisma.studyMaterial.findMany({ select: { id: true } })
     *
     */
    findMany<T extends StudyMaterialFindManyArgs>(
      args?: SelectSubset<T, StudyMaterialFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a StudyMaterial.
     * @param {StudyMaterialCreateArgs} args - Arguments to create a StudyMaterial.
     * @example
     * // Create one StudyMaterial
     * const StudyMaterial = await prisma.studyMaterial.create({
     *   data: {
     *     // ... data to create a StudyMaterial
     *   }
     * })
     *
     */
    create<T extends StudyMaterialCreateArgs>(
      args: SelectSubset<T, StudyMaterialCreateArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many StudyMaterials.
     * @param {StudyMaterialCreateManyArgs} args - Arguments to create many StudyMaterials.
     * @example
     * // Create many StudyMaterials
     * const studyMaterial = await prisma.studyMaterial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends StudyMaterialCreateManyArgs>(
      args?: SelectSubset<T, StudyMaterialCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many StudyMaterials and returns the data saved in the database.
     * @param {StudyMaterialCreateManyAndReturnArgs} args - Arguments to create many StudyMaterials.
     * @example
     * // Create many StudyMaterials
     * const studyMaterial = await prisma.studyMaterial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many StudyMaterials and only return the `id`
     * const studyMaterialWithIdOnly = await prisma.studyMaterial.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends StudyMaterialCreateManyAndReturnArgs>(
      args?: SelectSubset<T, StudyMaterialCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a StudyMaterial.
     * @param {StudyMaterialDeleteArgs} args - Arguments to delete one StudyMaterial.
     * @example
     * // Delete one StudyMaterial
     * const StudyMaterial = await prisma.studyMaterial.delete({
     *   where: {
     *     // ... filter to delete one StudyMaterial
     *   }
     * })
     *
     */
    delete<T extends StudyMaterialDeleteArgs>(
      args: SelectSubset<T, StudyMaterialDeleteArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one StudyMaterial.
     * @param {StudyMaterialUpdateArgs} args - Arguments to update one StudyMaterial.
     * @example
     * // Update one StudyMaterial
     * const studyMaterial = await prisma.studyMaterial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends StudyMaterialUpdateArgs>(
      args: SelectSubset<T, StudyMaterialUpdateArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more StudyMaterials.
     * @param {StudyMaterialDeleteManyArgs} args - Arguments to filter StudyMaterials to delete.
     * @example
     * // Delete a few StudyMaterials
     * const { count } = await prisma.studyMaterial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends StudyMaterialDeleteManyArgs>(
      args?: SelectSubset<T, StudyMaterialDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more StudyMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudyMaterials
     * const studyMaterial = await prisma.studyMaterial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends StudyMaterialUpdateManyArgs>(
      args: SelectSubset<T, StudyMaterialUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more StudyMaterials and returns the data updated in the database.
     * @param {StudyMaterialUpdateManyAndReturnArgs} args - Arguments to update many StudyMaterials.
     * @example
     * // Update many StudyMaterials
     * const studyMaterial = await prisma.studyMaterial.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more StudyMaterials and only return the `id`
     * const studyMaterialWithIdOnly = await prisma.studyMaterial.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends StudyMaterialUpdateManyAndReturnArgs>(
      args: SelectSubset<T, StudyMaterialUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one StudyMaterial.
     * @param {StudyMaterialUpsertArgs} args - Arguments to update or create a StudyMaterial.
     * @example
     * // Update or create a StudyMaterial
     * const studyMaterial = await prisma.studyMaterial.upsert({
     *   create: {
     *     // ... data to create a StudyMaterial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudyMaterial we want to update
     *   }
     * })
     */
    upsert<T extends StudyMaterialUpsertArgs>(
      args: SelectSubset<T, StudyMaterialUpsertArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      $Result.GetResult<
        Prisma.$StudyMaterialPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of StudyMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialCountArgs} args - Arguments to filter StudyMaterials to count.
     * @example
     * // Count the number of StudyMaterials
     * const count = await prisma.studyMaterial.count({
     *   where: {
     *     // ... the filter for the StudyMaterials we want to count
     *   }
     * })
     **/
    count<T extends StudyMaterialCountArgs>(
      args?: Subset<T, StudyMaterialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudyMaterialCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a StudyMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends StudyMaterialAggregateArgs>(
      args: Subset<T, StudyMaterialAggregateArgs>,
    ): Prisma.PrismaPromise<GetStudyMaterialAggregateType<T>>;

    /**
     * Group by StudyMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyMaterialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends StudyMaterialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudyMaterialGroupByArgs['orderBy'] }
        : { orderBy?: StudyMaterialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, StudyMaterialGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetStudyMaterialGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the StudyMaterial model
     */
    readonly fields: StudyMaterialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudyMaterial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudyMaterialClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    versions<T extends StudyMaterial$versionsArgs<ExtArgs> = {}>(
      args?: Subset<T, StudyMaterial$versionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MaterialVersionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    uploader<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the StudyMaterial model
   */
  interface StudyMaterialFieldRefs {
    readonly id: FieldRef<'StudyMaterial', 'String'>;
    readonly title: FieldRef<'StudyMaterial', 'String'>;
    readonly description: FieldRef<'StudyMaterial', 'String'>;
    readonly subject: FieldRef<'StudyMaterial', 'String'>;
    readonly type: FieldRef<'StudyMaterial', 'MaterialType'>;
    readonly file: FieldRef<'StudyMaterial', 'String'>;
    readonly uploaderId: FieldRef<'StudyMaterial', 'String'>;
    readonly createdAt: FieldRef<'StudyMaterial', 'DateTime'>;
    readonly updatedAt: FieldRef<'StudyMaterial', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * StudyMaterial findUnique
   */
  export type StudyMaterialFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * Filter, which StudyMaterial to fetch.
     */
    where: StudyMaterialWhereUniqueInput;
  };

  /**
   * StudyMaterial findUniqueOrThrow
   */
  export type StudyMaterialFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * Filter, which StudyMaterial to fetch.
     */
    where: StudyMaterialWhereUniqueInput;
  };

  /**
   * StudyMaterial findFirst
   */
  export type StudyMaterialFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * Filter, which StudyMaterial to fetch.
     */
    where?: StudyMaterialWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StudyMaterials to fetch.
     */
    orderBy?:
      | StudyMaterialOrderByWithRelationInput
      | StudyMaterialOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for StudyMaterials.
     */
    cursor?: StudyMaterialWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StudyMaterials from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StudyMaterials.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StudyMaterials.
     */
    distinct?: StudyMaterialScalarFieldEnum | StudyMaterialScalarFieldEnum[];
  };

  /**
   * StudyMaterial findFirstOrThrow
   */
  export type StudyMaterialFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * Filter, which StudyMaterial to fetch.
     */
    where?: StudyMaterialWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StudyMaterials to fetch.
     */
    orderBy?:
      | StudyMaterialOrderByWithRelationInput
      | StudyMaterialOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for StudyMaterials.
     */
    cursor?: StudyMaterialWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StudyMaterials from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StudyMaterials.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StudyMaterials.
     */
    distinct?: StudyMaterialScalarFieldEnum | StudyMaterialScalarFieldEnum[];
  };

  /**
   * StudyMaterial findMany
   */
  export type StudyMaterialFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * Filter, which StudyMaterials to fetch.
     */
    where?: StudyMaterialWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StudyMaterials to fetch.
     */
    orderBy?:
      | StudyMaterialOrderByWithRelationInput
      | StudyMaterialOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing StudyMaterials.
     */
    cursor?: StudyMaterialWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StudyMaterials from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StudyMaterials.
     */
    skip?: number;
    distinct?: StudyMaterialScalarFieldEnum | StudyMaterialScalarFieldEnum[];
  };

  /**
   * StudyMaterial create
   */
  export type StudyMaterialCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * The data needed to create a StudyMaterial.
     */
    data: XOR<StudyMaterialCreateInput, StudyMaterialUncheckedCreateInput>;
  };

  /**
   * StudyMaterial createMany
   */
  export type StudyMaterialCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many StudyMaterials.
     */
    data: StudyMaterialCreateManyInput | StudyMaterialCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * StudyMaterial createManyAndReturn
   */
  export type StudyMaterialCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * The data used to create many StudyMaterials.
     */
    data: StudyMaterialCreateManyInput | StudyMaterialCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * StudyMaterial update
   */
  export type StudyMaterialUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * The data needed to update a StudyMaterial.
     */
    data: XOR<StudyMaterialUpdateInput, StudyMaterialUncheckedUpdateInput>;
    /**
     * Choose, which StudyMaterial to update.
     */
    where: StudyMaterialWhereUniqueInput;
  };

  /**
   * StudyMaterial updateMany
   */
  export type StudyMaterialUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update StudyMaterials.
     */
    data: XOR<
      StudyMaterialUpdateManyMutationInput,
      StudyMaterialUncheckedUpdateManyInput
    >;
    /**
     * Filter which StudyMaterials to update
     */
    where?: StudyMaterialWhereInput;
    /**
     * Limit how many StudyMaterials to update.
     */
    limit?: number;
  };

  /**
   * StudyMaterial updateManyAndReturn
   */
  export type StudyMaterialUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * The data used to update StudyMaterials.
     */
    data: XOR<
      StudyMaterialUpdateManyMutationInput,
      StudyMaterialUncheckedUpdateManyInput
    >;
    /**
     * Filter which StudyMaterials to update
     */
    where?: StudyMaterialWhereInput;
    /**
     * Limit how many StudyMaterials to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * StudyMaterial upsert
   */
  export type StudyMaterialUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * The filter to search for the StudyMaterial to update in case it exists.
     */
    where: StudyMaterialWhereUniqueInput;
    /**
     * In case the StudyMaterial found by the `where` argument doesn't exist, create a new StudyMaterial with this data.
     */
    create: XOR<StudyMaterialCreateInput, StudyMaterialUncheckedCreateInput>;
    /**
     * In case the StudyMaterial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudyMaterialUpdateInput, StudyMaterialUncheckedUpdateInput>;
  };

  /**
   * StudyMaterial delete
   */
  export type StudyMaterialDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
    /**
     * Filter which StudyMaterial to delete.
     */
    where: StudyMaterialWhereUniqueInput;
  };

  /**
   * StudyMaterial deleteMany
   */
  export type StudyMaterialDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which StudyMaterials to delete
     */
    where?: StudyMaterialWhereInput;
    /**
     * Limit how many StudyMaterials to delete.
     */
    limit?: number;
  };

  /**
   * StudyMaterial.versions
   */
  export type StudyMaterial$versionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    where?: MaterialVersionWhereInput;
    orderBy?:
      | MaterialVersionOrderByWithRelationInput
      | MaterialVersionOrderByWithRelationInput[];
    cursor?: MaterialVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | MaterialVersionScalarFieldEnum
      | MaterialVersionScalarFieldEnum[];
  };

  /**
   * StudyMaterial without action
   */
  export type StudyMaterialDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the StudyMaterial
     */
    select?: StudyMaterialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StudyMaterial
     */
    omit?: StudyMaterialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyMaterialInclude<ExtArgs> | null;
  };

  /**
   * Model MaterialVersion
   */

  export type AggregateMaterialVersion = {
    _count: MaterialVersionCountAggregateOutputType | null;
    _avg: MaterialVersionAvgAggregateOutputType | null;
    _sum: MaterialVersionSumAggregateOutputType | null;
    _min: MaterialVersionMinAggregateOutputType | null;
    _max: MaterialVersionMaxAggregateOutputType | null;
  };

  export type MaterialVersionAvgAggregateOutputType = {
    version: number | null;
  };

  export type MaterialVersionSumAggregateOutputType = {
    version: number | null;
  };

  export type MaterialVersionMinAggregateOutputType = {
    id: string | null;
    version: number | null;
    file: string | null;
    materialId: string | null;
    uploaderId: string | null;
    createdAt: Date | null;
  };

  export type MaterialVersionMaxAggregateOutputType = {
    id: string | null;
    version: number | null;
    file: string | null;
    materialId: string | null;
    uploaderId: string | null;
    createdAt: Date | null;
  };

  export type MaterialVersionCountAggregateOutputType = {
    id: number;
    version: number;
    file: number;
    materialId: number;
    uploaderId: number;
    createdAt: number;
    _all: number;
  };

  export type MaterialVersionAvgAggregateInputType = {
    version?: true;
  };

  export type MaterialVersionSumAggregateInputType = {
    version?: true;
  };

  export type MaterialVersionMinAggregateInputType = {
    id?: true;
    version?: true;
    file?: true;
    materialId?: true;
    uploaderId?: true;
    createdAt?: true;
  };

  export type MaterialVersionMaxAggregateInputType = {
    id?: true;
    version?: true;
    file?: true;
    materialId?: true;
    uploaderId?: true;
    createdAt?: true;
  };

  export type MaterialVersionCountAggregateInputType = {
    id?: true;
    version?: true;
    file?: true;
    materialId?: true;
    uploaderId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type MaterialVersionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which MaterialVersion to aggregate.
     */
    where?: MaterialVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaterialVersions to fetch.
     */
    orderBy?:
      | MaterialVersionOrderByWithRelationInput
      | MaterialVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MaterialVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaterialVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaterialVersions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MaterialVersions
     **/
    _count?: true | MaterialVersionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: MaterialVersionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: MaterialVersionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: MaterialVersionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: MaterialVersionMaxAggregateInputType;
  };

  export type GetMaterialVersionAggregateType<
    T extends MaterialVersionAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateMaterialVersion]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaterialVersion[P]>
      : GetScalarType<T[P], AggregateMaterialVersion[P]>;
  };

  export type MaterialVersionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MaterialVersionWhereInput;
    orderBy?:
      | MaterialVersionOrderByWithAggregationInput
      | MaterialVersionOrderByWithAggregationInput[];
    by: MaterialVersionScalarFieldEnum[] | MaterialVersionScalarFieldEnum;
    having?: MaterialVersionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MaterialVersionCountAggregateInputType | true;
    _avg?: MaterialVersionAvgAggregateInputType;
    _sum?: MaterialVersionSumAggregateInputType;
    _min?: MaterialVersionMinAggregateInputType;
    _max?: MaterialVersionMaxAggregateInputType;
  };

  export type MaterialVersionGroupByOutputType = {
    id: string;
    version: number;
    file: string;
    materialId: string;
    uploaderId: string;
    createdAt: Date;
    _count: MaterialVersionCountAggregateOutputType | null;
    _avg: MaterialVersionAvgAggregateOutputType | null;
    _sum: MaterialVersionSumAggregateOutputType | null;
    _min: MaterialVersionMinAggregateOutputType | null;
    _max: MaterialVersionMaxAggregateOutputType | null;
  };

  type GetMaterialVersionGroupByPayload<T extends MaterialVersionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<MaterialVersionGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof MaterialVersionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaterialVersionGroupByOutputType[P]>
            : GetScalarType<T[P], MaterialVersionGroupByOutputType[P]>;
        }
      >
    >;

  export type MaterialVersionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      version?: boolean;
      file?: boolean;
      materialId?: boolean;
      uploaderId?: boolean;
      createdAt?: boolean;
      material?: boolean | StudyMaterialDefaultArgs<ExtArgs>;
      uploader?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['materialVersion']
  >;

  export type MaterialVersionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      version?: boolean;
      file?: boolean;
      materialId?: boolean;
      uploaderId?: boolean;
      createdAt?: boolean;
      material?: boolean | StudyMaterialDefaultArgs<ExtArgs>;
      uploader?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['materialVersion']
  >;

  export type MaterialVersionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      version?: boolean;
      file?: boolean;
      materialId?: boolean;
      uploaderId?: boolean;
      createdAt?: boolean;
      material?: boolean | StudyMaterialDefaultArgs<ExtArgs>;
      uploader?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['materialVersion']
  >;

  export type MaterialVersionSelectScalar = {
    id?: boolean;
    version?: boolean;
    file?: boolean;
    materialId?: boolean;
    uploaderId?: boolean;
    createdAt?: boolean;
  };

  export type MaterialVersionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'version' | 'file' | 'materialId' | 'uploaderId' | 'createdAt',
    ExtArgs['result']['materialVersion']
  >;
  export type MaterialVersionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    material?: boolean | StudyMaterialDefaultArgs<ExtArgs>;
    uploader?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type MaterialVersionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    material?: boolean | StudyMaterialDefaultArgs<ExtArgs>;
    uploader?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type MaterialVersionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    material?: boolean | StudyMaterialDefaultArgs<ExtArgs>;
    uploader?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $MaterialVersionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'MaterialVersion';
    objects: {
      material: Prisma.$StudyMaterialPayload<ExtArgs>;
      uploader: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        version: number;
        file: string;
        materialId: string;
        uploaderId: string;
        createdAt: Date;
      },
      ExtArgs['result']['materialVersion']
    >;
    composites: {};
  };

  type MaterialVersionGetPayload<
    S extends boolean | null | undefined | MaterialVersionDefaultArgs,
  > = $Result.GetResult<Prisma.$MaterialVersionPayload, S>;

  type MaterialVersionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    MaterialVersionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: MaterialVersionCountAggregateInputType | true;
  };

  export interface MaterialVersionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['MaterialVersion'];
      meta: { name: 'MaterialVersion' };
    };
    /**
     * Find zero or one MaterialVersion that matches the filter.
     * @param {MaterialVersionFindUniqueArgs} args - Arguments to find a MaterialVersion
     * @example
     * // Get one MaterialVersion
     * const materialVersion = await prisma.materialVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaterialVersionFindUniqueArgs>(
      args: SelectSubset<T, MaterialVersionFindUniqueArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one MaterialVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaterialVersionFindUniqueOrThrowArgs} args - Arguments to find a MaterialVersion
     * @example
     * // Get one MaterialVersion
     * const materialVersion = await prisma.materialVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaterialVersionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MaterialVersionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first MaterialVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionFindFirstArgs} args - Arguments to find a MaterialVersion
     * @example
     * // Get one MaterialVersion
     * const materialVersion = await prisma.materialVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaterialVersionFindFirstArgs>(
      args?: SelectSubset<T, MaterialVersionFindFirstArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first MaterialVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionFindFirstOrThrowArgs} args - Arguments to find a MaterialVersion
     * @example
     * // Get one MaterialVersion
     * const materialVersion = await prisma.materialVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaterialVersionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MaterialVersionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more MaterialVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaterialVersions
     * const materialVersions = await prisma.materialVersion.findMany()
     *
     * // Get first 10 MaterialVersions
     * const materialVersions = await prisma.materialVersion.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const materialVersionWithIdOnly = await prisma.materialVersion.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MaterialVersionFindManyArgs>(
      args?: SelectSubset<T, MaterialVersionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a MaterialVersion.
     * @param {MaterialVersionCreateArgs} args - Arguments to create a MaterialVersion.
     * @example
     * // Create one MaterialVersion
     * const MaterialVersion = await prisma.materialVersion.create({
     *   data: {
     *     // ... data to create a MaterialVersion
     *   }
     * })
     *
     */
    create<T extends MaterialVersionCreateArgs>(
      args: SelectSubset<T, MaterialVersionCreateArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many MaterialVersions.
     * @param {MaterialVersionCreateManyArgs} args - Arguments to create many MaterialVersions.
     * @example
     * // Create many MaterialVersions
     * const materialVersion = await prisma.materialVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MaterialVersionCreateManyArgs>(
      args?: SelectSubset<T, MaterialVersionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many MaterialVersions and returns the data saved in the database.
     * @param {MaterialVersionCreateManyAndReturnArgs} args - Arguments to create many MaterialVersions.
     * @example
     * // Create many MaterialVersions
     * const materialVersion = await prisma.materialVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many MaterialVersions and only return the `id`
     * const materialVersionWithIdOnly = await prisma.materialVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MaterialVersionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MaterialVersionCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a MaterialVersion.
     * @param {MaterialVersionDeleteArgs} args - Arguments to delete one MaterialVersion.
     * @example
     * // Delete one MaterialVersion
     * const MaterialVersion = await prisma.materialVersion.delete({
     *   where: {
     *     // ... filter to delete one MaterialVersion
     *   }
     * })
     *
     */
    delete<T extends MaterialVersionDeleteArgs>(
      args: SelectSubset<T, MaterialVersionDeleteArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one MaterialVersion.
     * @param {MaterialVersionUpdateArgs} args - Arguments to update one MaterialVersion.
     * @example
     * // Update one MaterialVersion
     * const materialVersion = await prisma.materialVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MaterialVersionUpdateArgs>(
      args: SelectSubset<T, MaterialVersionUpdateArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more MaterialVersions.
     * @param {MaterialVersionDeleteManyArgs} args - Arguments to filter MaterialVersions to delete.
     * @example
     * // Delete a few MaterialVersions
     * const { count } = await prisma.materialVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MaterialVersionDeleteManyArgs>(
      args?: SelectSubset<T, MaterialVersionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more MaterialVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaterialVersions
     * const materialVersion = await prisma.materialVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MaterialVersionUpdateManyArgs>(
      args: SelectSubset<T, MaterialVersionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more MaterialVersions and returns the data updated in the database.
     * @param {MaterialVersionUpdateManyAndReturnArgs} args - Arguments to update many MaterialVersions.
     * @example
     * // Update many MaterialVersions
     * const materialVersion = await prisma.materialVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more MaterialVersions and only return the `id`
     * const materialVersionWithIdOnly = await prisma.materialVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MaterialVersionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MaterialVersionUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one MaterialVersion.
     * @param {MaterialVersionUpsertArgs} args - Arguments to update or create a MaterialVersion.
     * @example
     * // Update or create a MaterialVersion
     * const materialVersion = await prisma.materialVersion.upsert({
     *   create: {
     *     // ... data to create a MaterialVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaterialVersion we want to update
     *   }
     * })
     */
    upsert<T extends MaterialVersionUpsertArgs>(
      args: SelectSubset<T, MaterialVersionUpsertArgs<ExtArgs>>,
    ): Prisma__MaterialVersionClient<
      $Result.GetResult<
        Prisma.$MaterialVersionPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of MaterialVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionCountArgs} args - Arguments to filter MaterialVersions to count.
     * @example
     * // Count the number of MaterialVersions
     * const count = await prisma.materialVersion.count({
     *   where: {
     *     // ... the filter for the MaterialVersions we want to count
     *   }
     * })
     **/
    count<T extends MaterialVersionCountArgs>(
      args?: Subset<T, MaterialVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaterialVersionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a MaterialVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends MaterialVersionAggregateArgs>(
      args: Subset<T, MaterialVersionAggregateArgs>,
    ): Prisma.PrismaPromise<GetMaterialVersionAggregateType<T>>;

    /**
     * Group by MaterialVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends MaterialVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaterialVersionGroupByArgs['orderBy'] }
        : { orderBy?: MaterialVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, MaterialVersionGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetMaterialVersionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MaterialVersion model
     */
    readonly fields: MaterialVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaterialVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaterialVersionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    material<T extends StudyMaterialDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, StudyMaterialDefaultArgs<ExtArgs>>,
    ): Prisma__StudyMaterialClient<
      | $Result.GetResult<
          Prisma.$StudyMaterialPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    uploader<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the MaterialVersion model
   */
  interface MaterialVersionFieldRefs {
    readonly id: FieldRef<'MaterialVersion', 'String'>;
    readonly version: FieldRef<'MaterialVersion', 'Int'>;
    readonly file: FieldRef<'MaterialVersion', 'String'>;
    readonly materialId: FieldRef<'MaterialVersion', 'String'>;
    readonly uploaderId: FieldRef<'MaterialVersion', 'String'>;
    readonly createdAt: FieldRef<'MaterialVersion', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * MaterialVersion findUnique
   */
  export type MaterialVersionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * Filter, which MaterialVersion to fetch.
     */
    where: MaterialVersionWhereUniqueInput;
  };

  /**
   * MaterialVersion findUniqueOrThrow
   */
  export type MaterialVersionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * Filter, which MaterialVersion to fetch.
     */
    where: MaterialVersionWhereUniqueInput;
  };

  /**
   * MaterialVersion findFirst
   */
  export type MaterialVersionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * Filter, which MaterialVersion to fetch.
     */
    where?: MaterialVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaterialVersions to fetch.
     */
    orderBy?:
      | MaterialVersionOrderByWithRelationInput
      | MaterialVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MaterialVersions.
     */
    cursor?: MaterialVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaterialVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaterialVersions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MaterialVersions.
     */
    distinct?:
      | MaterialVersionScalarFieldEnum
      | MaterialVersionScalarFieldEnum[];
  };

  /**
   * MaterialVersion findFirstOrThrow
   */
  export type MaterialVersionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * Filter, which MaterialVersion to fetch.
     */
    where?: MaterialVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaterialVersions to fetch.
     */
    orderBy?:
      | MaterialVersionOrderByWithRelationInput
      | MaterialVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MaterialVersions.
     */
    cursor?: MaterialVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaterialVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaterialVersions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MaterialVersions.
     */
    distinct?:
      | MaterialVersionScalarFieldEnum
      | MaterialVersionScalarFieldEnum[];
  };

  /**
   * MaterialVersion findMany
   */
  export type MaterialVersionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * Filter, which MaterialVersions to fetch.
     */
    where?: MaterialVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaterialVersions to fetch.
     */
    orderBy?:
      | MaterialVersionOrderByWithRelationInput
      | MaterialVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MaterialVersions.
     */
    cursor?: MaterialVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaterialVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaterialVersions.
     */
    skip?: number;
    distinct?:
      | MaterialVersionScalarFieldEnum
      | MaterialVersionScalarFieldEnum[];
  };

  /**
   * MaterialVersion create
   */
  export type MaterialVersionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * The data needed to create a MaterialVersion.
     */
    data: XOR<MaterialVersionCreateInput, MaterialVersionUncheckedCreateInput>;
  };

  /**
   * MaterialVersion createMany
   */
  export type MaterialVersionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many MaterialVersions.
     */
    data: MaterialVersionCreateManyInput | MaterialVersionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * MaterialVersion createManyAndReturn
   */
  export type MaterialVersionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * The data used to create many MaterialVersions.
     */
    data: MaterialVersionCreateManyInput | MaterialVersionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * MaterialVersion update
   */
  export type MaterialVersionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * The data needed to update a MaterialVersion.
     */
    data: XOR<MaterialVersionUpdateInput, MaterialVersionUncheckedUpdateInput>;
    /**
     * Choose, which MaterialVersion to update.
     */
    where: MaterialVersionWhereUniqueInput;
  };

  /**
   * MaterialVersion updateMany
   */
  export type MaterialVersionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update MaterialVersions.
     */
    data: XOR<
      MaterialVersionUpdateManyMutationInput,
      MaterialVersionUncheckedUpdateManyInput
    >;
    /**
     * Filter which MaterialVersions to update
     */
    where?: MaterialVersionWhereInput;
    /**
     * Limit how many MaterialVersions to update.
     */
    limit?: number;
  };

  /**
   * MaterialVersion updateManyAndReturn
   */
  export type MaterialVersionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * The data used to update MaterialVersions.
     */
    data: XOR<
      MaterialVersionUpdateManyMutationInput,
      MaterialVersionUncheckedUpdateManyInput
    >;
    /**
     * Filter which MaterialVersions to update
     */
    where?: MaterialVersionWhereInput;
    /**
     * Limit how many MaterialVersions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * MaterialVersion upsert
   */
  export type MaterialVersionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * The filter to search for the MaterialVersion to update in case it exists.
     */
    where: MaterialVersionWhereUniqueInput;
    /**
     * In case the MaterialVersion found by the `where` argument doesn't exist, create a new MaterialVersion with this data.
     */
    create: XOR<
      MaterialVersionCreateInput,
      MaterialVersionUncheckedCreateInput
    >;
    /**
     * In case the MaterialVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      MaterialVersionUpdateInput,
      MaterialVersionUncheckedUpdateInput
    >;
  };

  /**
   * MaterialVersion delete
   */
  export type MaterialVersionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
    /**
     * Filter which MaterialVersion to delete.
     */
    where: MaterialVersionWhereUniqueInput;
  };

  /**
   * MaterialVersion deleteMany
   */
  export type MaterialVersionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which MaterialVersions to delete
     */
    where?: MaterialVersionWhereInput;
    /**
     * Limit how many MaterialVersions to delete.
     */
    limit?: number;
  };

  /**
   * MaterialVersion without action
   */
  export type MaterialVersionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaterialVersion
     */
    select?: MaterialVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaterialVersion
     */
    omit?: MaterialVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialVersionInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UserScalarFieldEnum: {
    id: 'id';
    email: 'email';
    password: 'password';
    name: 'name';
    role: 'role';
    verified: 'verified';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type UserScalarFieldEnum =
    (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const ProfileScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    college: 'college';
    year: 'year';
    major: 'major';
    bio: 'bio';
    avatar: 'avatar';
    social: 'social';
    interests: 'interests';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ProfileScalarFieldEnum =
    (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];

  export const ClubScalarFieldEnum: {
    id: 'id';
    name: 'name';
    description: 'description';
    cover: 'cover';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ClubScalarFieldEnum =
    (typeof ClubScalarFieldEnum)[keyof typeof ClubScalarFieldEnum];

  export const ClubMemberScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    clubId: 'clubId';
    role: 'role';
    joinedAt: 'joinedAt';
  };

  export type ClubMemberScalarFieldEnum =
    (typeof ClubMemberScalarFieldEnum)[keyof typeof ClubMemberScalarFieldEnum];

  export const EventScalarFieldEnum: {
    id: 'id';
    title: 'title';
    description: 'description';
    startDate: 'startDate';
    endDate: 'endDate';
    location: 'location';
    clubId: 'clubId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type EventScalarFieldEnum =
    (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];

  export const EventAttendeeScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    eventId: 'eventId';
    status: 'status';
  };

  export type EventAttendeeScalarFieldEnum =
    (typeof EventAttendeeScalarFieldEnum)[keyof typeof EventAttendeeScalarFieldEnum];

  export const ListingScalarFieldEnum: {
    id: 'id';
    title: 'title';
    description: 'description';
    price: 'price';
    condition: 'condition';
    category: 'category';
    images: 'images';
    sellerId: 'sellerId';
    status: 'status';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ListingScalarFieldEnum =
    (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum];

  export const MessageScalarFieldEnum: {
    id: 'id';
    content: 'content';
    senderId: 'senderId';
    listingId: 'listingId';
    createdAt: 'createdAt';
  };

  export type MessageScalarFieldEnum =
    (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];

  export const StudyMaterialScalarFieldEnum: {
    id: 'id';
    title: 'title';
    description: 'description';
    subject: 'subject';
    type: 'type';
    file: 'file';
    uploaderId: 'uploaderId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type StudyMaterialScalarFieldEnum =
    (typeof StudyMaterialScalarFieldEnum)[keyof typeof StudyMaterialScalarFieldEnum];

  export const MaterialVersionScalarFieldEnum: {
    id: 'id';
    version: 'version';
    file: 'file';
    materialId: 'materialId';
    uploaderId: 'uploaderId';
    createdAt: 'createdAt';
  };

  export type MaterialVersionScalarFieldEnum =
    (typeof MaterialVersionScalarFieldEnum)[keyof typeof MaterialVersionScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
  };

  export type NullableJsonNullValueInput =
    (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter =
    (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'UserRole'
  >;

  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'UserRole[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >;

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'QueryMode'
  >;

  /**
   * Reference to a field of type 'ClubRole'
   */
  export type EnumClubRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'ClubRole'
  >;

  /**
   * Reference to a field of type 'ClubRole[]'
   */
  export type ListEnumClubRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'ClubRole[]'
  >;

  /**
   * Reference to a field of type 'RSVPStatus'
   */
  export type EnumRSVPStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'RSVPStatus'
  >;

  /**
   * Reference to a field of type 'RSVPStatus[]'
   */
  export type ListEnumRSVPStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'RSVPStatus[]'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;

  /**
   * Reference to a field of type 'Condition'
   */
  export type EnumConditionFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Condition'
  >;

  /**
   * Reference to a field of type 'Condition[]'
   */
  export type ListEnumConditionFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Condition[]'
  >;

  /**
   * Reference to a field of type 'Category'
   */
  export type EnumCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Category'
  >;

  /**
   * Reference to a field of type 'Category[]'
   */
  export type ListEnumCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Category[]'
  >;

  /**
   * Reference to a field of type 'ListingStatus'
   */
  export type EnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'ListingStatus'
  >;

  /**
   * Reference to a field of type 'ListingStatus[]'
   */
  export type ListEnumListingStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'ListingStatus[]'>;

  /**
   * Reference to a field of type 'MaterialType'
   */
  export type EnumMaterialTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'MaterialType'
  >;

  /**
   * Reference to a field of type 'MaterialType[]'
   */
  export type ListEnumMaterialTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'MaterialType[]'>;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    email?: StringFilter<'User'> | string;
    password?: StringFilter<'User'> | string;
    name?: StringNullableFilter<'User'> | string | null;
    role?: EnumUserRoleFilter<'User'> | $Enums.UserRole;
    verified?: BoolFilter<'User'> | boolean;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    updatedAt?: DateTimeFilter<'User'> | Date | string;
    profile?: XOR<
      ProfileNullableScalarRelationFilter,
      ProfileWhereInput
    > | null;
    clubMembers?: ClubMemberListRelationFilter;
    eventAttendees?: EventAttendeeListRelationFilter;
    listings?: ListingListRelationFilter;
    messages?: MessageListRelationFilter;
    materials?: StudyMaterialListRelationFilter;
    materialVersions?: MaterialVersionListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrderInput | SortOrder;
    role?: SortOrder;
    verified?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    profile?: ProfileOrderByWithRelationInput;
    clubMembers?: ClubMemberOrderByRelationAggregateInput;
    eventAttendees?: EventAttendeeOrderByRelationAggregateInput;
    listings?: ListingOrderByRelationAggregateInput;
    messages?: MessageOrderByRelationAggregateInput;
    materials?: StudyMaterialOrderByRelationAggregateInput;
    materialVersions?: MaterialVersionOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      password?: StringFilter<'User'> | string;
      name?: StringNullableFilter<'User'> | string | null;
      role?: EnumUserRoleFilter<'User'> | $Enums.UserRole;
      verified?: BoolFilter<'User'> | boolean;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      updatedAt?: DateTimeFilter<'User'> | Date | string;
      profile?: XOR<
        ProfileNullableScalarRelationFilter,
        ProfileWhereInput
      > | null;
      clubMembers?: ClubMemberListRelationFilter;
      eventAttendees?: EventAttendeeListRelationFilter;
      listings?: ListingListRelationFilter;
      messages?: MessageListRelationFilter;
      materials?: StudyMaterialListRelationFilter;
      materialVersions?: MaterialVersionListRelationFilter;
    },
    'id' | 'email'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrderInput | SortOrder;
    role?: SortOrder;
    verified?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    email?: StringWithAggregatesFilter<'User'> | string;
    password?: StringWithAggregatesFilter<'User'> | string;
    name?: StringNullableWithAggregatesFilter<'User'> | string | null;
    role?: EnumUserRoleWithAggregatesFilter<'User'> | $Enums.UserRole;
    verified?: BoolWithAggregatesFilter<'User'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
  };

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[];
    OR?: ProfileWhereInput[];
    NOT?: ProfileWhereInput | ProfileWhereInput[];
    id?: StringFilter<'Profile'> | string;
    userId?: StringFilter<'Profile'> | string;
    college?: StringFilter<'Profile'> | string;
    year?: IntFilter<'Profile'> | number;
    major?: StringFilter<'Profile'> | string;
    bio?: StringNullableFilter<'Profile'> | string | null;
    avatar?: StringNullableFilter<'Profile'> | string | null;
    social?: JsonNullableFilter<'Profile'>;
    interests?: StringNullableListFilter<'Profile'>;
    createdAt?: DateTimeFilter<'Profile'> | Date | string;
    updatedAt?: DateTimeFilter<'Profile'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    college?: SortOrder;
    year?: SortOrder;
    major?: SortOrder;
    bio?: SortOrderInput | SortOrder;
    avatar?: SortOrderInput | SortOrder;
    social?: SortOrderInput | SortOrder;
    interests?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type ProfileWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId?: string;
      AND?: ProfileWhereInput | ProfileWhereInput[];
      OR?: ProfileWhereInput[];
      NOT?: ProfileWhereInput | ProfileWhereInput[];
      college?: StringFilter<'Profile'> | string;
      year?: IntFilter<'Profile'> | number;
      major?: StringFilter<'Profile'> | string;
      bio?: StringNullableFilter<'Profile'> | string | null;
      avatar?: StringNullableFilter<'Profile'> | string | null;
      social?: JsonNullableFilter<'Profile'>;
      interests?: StringNullableListFilter<'Profile'>;
      createdAt?: DateTimeFilter<'Profile'> | Date | string;
      updatedAt?: DateTimeFilter<'Profile'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId'
  >;

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    college?: SortOrder;
    year?: SortOrder;
    major?: SortOrder;
    bio?: SortOrderInput | SortOrder;
    avatar?: SortOrderInput | SortOrder;
    social?: SortOrderInput | SortOrder;
    interests?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ProfileCountOrderByAggregateInput;
    _avg?: ProfileAvgOrderByAggregateInput;
    _max?: ProfileMaxOrderByAggregateInput;
    _min?: ProfileMinOrderByAggregateInput;
    _sum?: ProfileSumOrderByAggregateInput;
  };

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?:
      | ProfileScalarWhereWithAggregatesInput
      | ProfileScalarWhereWithAggregatesInput[];
    OR?: ProfileScalarWhereWithAggregatesInput[];
    NOT?:
      | ProfileScalarWhereWithAggregatesInput
      | ProfileScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Profile'> | string;
    userId?: StringWithAggregatesFilter<'Profile'> | string;
    college?: StringWithAggregatesFilter<'Profile'> | string;
    year?: IntWithAggregatesFilter<'Profile'> | number;
    major?: StringWithAggregatesFilter<'Profile'> | string;
    bio?: StringNullableWithAggregatesFilter<'Profile'> | string | null;
    avatar?: StringNullableWithAggregatesFilter<'Profile'> | string | null;
    social?: JsonNullableWithAggregatesFilter<'Profile'>;
    interests?: StringNullableListFilter<'Profile'>;
    createdAt?: DateTimeWithAggregatesFilter<'Profile'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Profile'> | Date | string;
  };

  export type ClubWhereInput = {
    AND?: ClubWhereInput | ClubWhereInput[];
    OR?: ClubWhereInput[];
    NOT?: ClubWhereInput | ClubWhereInput[];
    id?: StringFilter<'Club'> | string;
    name?: StringFilter<'Club'> | string;
    description?: StringFilter<'Club'> | string;
    cover?: StringNullableFilter<'Club'> | string | null;
    createdAt?: DateTimeFilter<'Club'> | Date | string;
    updatedAt?: DateTimeFilter<'Club'> | Date | string;
    members?: ClubMemberListRelationFilter;
    events?: EventListRelationFilter;
  };

  export type ClubOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    cover?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    members?: ClubMemberOrderByRelationAggregateInput;
    events?: EventOrderByRelationAggregateInput;
  };

  export type ClubWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ClubWhereInput | ClubWhereInput[];
      OR?: ClubWhereInput[];
      NOT?: ClubWhereInput | ClubWhereInput[];
      name?: StringFilter<'Club'> | string;
      description?: StringFilter<'Club'> | string;
      cover?: StringNullableFilter<'Club'> | string | null;
      createdAt?: DateTimeFilter<'Club'> | Date | string;
      updatedAt?: DateTimeFilter<'Club'> | Date | string;
      members?: ClubMemberListRelationFilter;
      events?: EventListRelationFilter;
    },
    'id'
  >;

  export type ClubOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    cover?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ClubCountOrderByAggregateInput;
    _max?: ClubMaxOrderByAggregateInput;
    _min?: ClubMinOrderByAggregateInput;
  };

  export type ClubScalarWhereWithAggregatesInput = {
    AND?:
      | ClubScalarWhereWithAggregatesInput
      | ClubScalarWhereWithAggregatesInput[];
    OR?: ClubScalarWhereWithAggregatesInput[];
    NOT?:
      | ClubScalarWhereWithAggregatesInput
      | ClubScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Club'> | string;
    name?: StringWithAggregatesFilter<'Club'> | string;
    description?: StringWithAggregatesFilter<'Club'> | string;
    cover?: StringNullableWithAggregatesFilter<'Club'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Club'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Club'> | Date | string;
  };

  export type ClubMemberWhereInput = {
    AND?: ClubMemberWhereInput | ClubMemberWhereInput[];
    OR?: ClubMemberWhereInput[];
    NOT?: ClubMemberWhereInput | ClubMemberWhereInput[];
    id?: StringFilter<'ClubMember'> | string;
    userId?: StringFilter<'ClubMember'> | string;
    clubId?: StringFilter<'ClubMember'> | string;
    role?: EnumClubRoleFilter<'ClubMember'> | $Enums.ClubRole;
    joinedAt?: DateTimeFilter<'ClubMember'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    club?: XOR<ClubScalarRelationFilter, ClubWhereInput>;
  };

  export type ClubMemberOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    clubId?: SortOrder;
    role?: SortOrder;
    joinedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    club?: ClubOrderByWithRelationInput;
  };

  export type ClubMemberWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_clubId?: ClubMemberUserIdClubIdCompoundUniqueInput;
      AND?: ClubMemberWhereInput | ClubMemberWhereInput[];
      OR?: ClubMemberWhereInput[];
      NOT?: ClubMemberWhereInput | ClubMemberWhereInput[];
      userId?: StringFilter<'ClubMember'> | string;
      clubId?: StringFilter<'ClubMember'> | string;
      role?: EnumClubRoleFilter<'ClubMember'> | $Enums.ClubRole;
      joinedAt?: DateTimeFilter<'ClubMember'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      club?: XOR<ClubScalarRelationFilter, ClubWhereInput>;
    },
    'id' | 'userId_clubId'
  >;

  export type ClubMemberOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    clubId?: SortOrder;
    role?: SortOrder;
    joinedAt?: SortOrder;
    _count?: ClubMemberCountOrderByAggregateInput;
    _max?: ClubMemberMaxOrderByAggregateInput;
    _min?: ClubMemberMinOrderByAggregateInput;
  };

  export type ClubMemberScalarWhereWithAggregatesInput = {
    AND?:
      | ClubMemberScalarWhereWithAggregatesInput
      | ClubMemberScalarWhereWithAggregatesInput[];
    OR?: ClubMemberScalarWhereWithAggregatesInput[];
    NOT?:
      | ClubMemberScalarWhereWithAggregatesInput
      | ClubMemberScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ClubMember'> | string;
    userId?: StringWithAggregatesFilter<'ClubMember'> | string;
    clubId?: StringWithAggregatesFilter<'ClubMember'> | string;
    role?: EnumClubRoleWithAggregatesFilter<'ClubMember'> | $Enums.ClubRole;
    joinedAt?: DateTimeWithAggregatesFilter<'ClubMember'> | Date | string;
  };

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[];
    OR?: EventWhereInput[];
    NOT?: EventWhereInput | EventWhereInput[];
    id?: StringFilter<'Event'> | string;
    title?: StringFilter<'Event'> | string;
    description?: StringFilter<'Event'> | string;
    startDate?: DateTimeFilter<'Event'> | Date | string;
    endDate?: DateTimeFilter<'Event'> | Date | string;
    location?: StringNullableFilter<'Event'> | string | null;
    clubId?: StringNullableFilter<'Event'> | string | null;
    createdAt?: DateTimeFilter<'Event'> | Date | string;
    updatedAt?: DateTimeFilter<'Event'> | Date | string;
    club?: XOR<ClubNullableScalarRelationFilter, ClubWhereInput> | null;
    attendees?: EventAttendeeListRelationFilter;
  };

  export type EventOrderByWithRelationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    location?: SortOrderInput | SortOrder;
    clubId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    club?: ClubOrderByWithRelationInput;
    attendees?: EventAttendeeOrderByRelationAggregateInput;
  };

  export type EventWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: EventWhereInput | EventWhereInput[];
      OR?: EventWhereInput[];
      NOT?: EventWhereInput | EventWhereInput[];
      title?: StringFilter<'Event'> | string;
      description?: StringFilter<'Event'> | string;
      startDate?: DateTimeFilter<'Event'> | Date | string;
      endDate?: DateTimeFilter<'Event'> | Date | string;
      location?: StringNullableFilter<'Event'> | string | null;
      clubId?: StringNullableFilter<'Event'> | string | null;
      createdAt?: DateTimeFilter<'Event'> | Date | string;
      updatedAt?: DateTimeFilter<'Event'> | Date | string;
      club?: XOR<ClubNullableScalarRelationFilter, ClubWhereInput> | null;
      attendees?: EventAttendeeListRelationFilter;
    },
    'id'
  >;

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    location?: SortOrderInput | SortOrder;
    clubId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: EventCountOrderByAggregateInput;
    _max?: EventMaxOrderByAggregateInput;
    _min?: EventMinOrderByAggregateInput;
  };

  export type EventScalarWhereWithAggregatesInput = {
    AND?:
      | EventScalarWhereWithAggregatesInput
      | EventScalarWhereWithAggregatesInput[];
    OR?: EventScalarWhereWithAggregatesInput[];
    NOT?:
      | EventScalarWhereWithAggregatesInput
      | EventScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Event'> | string;
    title?: StringWithAggregatesFilter<'Event'> | string;
    description?: StringWithAggregatesFilter<'Event'> | string;
    startDate?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
    endDate?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
    location?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    clubId?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
  };

  export type EventAttendeeWhereInput = {
    AND?: EventAttendeeWhereInput | EventAttendeeWhereInput[];
    OR?: EventAttendeeWhereInput[];
    NOT?: EventAttendeeWhereInput | EventAttendeeWhereInput[];
    id?: StringFilter<'EventAttendee'> | string;
    userId?: StringFilter<'EventAttendee'> | string;
    eventId?: StringFilter<'EventAttendee'> | string;
    status?: EnumRSVPStatusFilter<'EventAttendee'> | $Enums.RSVPStatus;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    event?: XOR<EventScalarRelationFilter, EventWhereInput>;
  };

  export type EventAttendeeOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
    status?: SortOrder;
    user?: UserOrderByWithRelationInput;
    event?: EventOrderByWithRelationInput;
  };

  export type EventAttendeeWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_eventId?: EventAttendeeUserIdEventIdCompoundUniqueInput;
      AND?: EventAttendeeWhereInput | EventAttendeeWhereInput[];
      OR?: EventAttendeeWhereInput[];
      NOT?: EventAttendeeWhereInput | EventAttendeeWhereInput[];
      userId?: StringFilter<'EventAttendee'> | string;
      eventId?: StringFilter<'EventAttendee'> | string;
      status?: EnumRSVPStatusFilter<'EventAttendee'> | $Enums.RSVPStatus;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      event?: XOR<EventScalarRelationFilter, EventWhereInput>;
    },
    'id' | 'userId_eventId'
  >;

  export type EventAttendeeOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
    status?: SortOrder;
    _count?: EventAttendeeCountOrderByAggregateInput;
    _max?: EventAttendeeMaxOrderByAggregateInput;
    _min?: EventAttendeeMinOrderByAggregateInput;
  };

  export type EventAttendeeScalarWhereWithAggregatesInput = {
    AND?:
      | EventAttendeeScalarWhereWithAggregatesInput
      | EventAttendeeScalarWhereWithAggregatesInput[];
    OR?: EventAttendeeScalarWhereWithAggregatesInput[];
    NOT?:
      | EventAttendeeScalarWhereWithAggregatesInput
      | EventAttendeeScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'EventAttendee'> | string;
    userId?: StringWithAggregatesFilter<'EventAttendee'> | string;
    eventId?: StringWithAggregatesFilter<'EventAttendee'> | string;
    status?:
      | EnumRSVPStatusWithAggregatesFilter<'EventAttendee'>
      | $Enums.RSVPStatus;
  };

  export type ListingWhereInput = {
    AND?: ListingWhereInput | ListingWhereInput[];
    OR?: ListingWhereInput[];
    NOT?: ListingWhereInput | ListingWhereInput[];
    id?: StringFilter<'Listing'> | string;
    title?: StringFilter<'Listing'> | string;
    description?: StringFilter<'Listing'> | string;
    price?: FloatFilter<'Listing'> | number;
    condition?: EnumConditionFilter<'Listing'> | $Enums.Condition;
    category?: EnumCategoryFilter<'Listing'> | $Enums.Category;
    images?: StringNullableListFilter<'Listing'>;
    sellerId?: StringFilter<'Listing'> | string;
    status?: EnumListingStatusFilter<'Listing'> | $Enums.ListingStatus;
    createdAt?: DateTimeFilter<'Listing'> | Date | string;
    updatedAt?: DateTimeFilter<'Listing'> | Date | string;
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>;
    messages?: MessageListRelationFilter;
  };

  export type ListingOrderByWithRelationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    condition?: SortOrder;
    category?: SortOrder;
    images?: SortOrder;
    sellerId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    seller?: UserOrderByWithRelationInput;
    messages?: MessageOrderByRelationAggregateInput;
  };

  export type ListingWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ListingWhereInput | ListingWhereInput[];
      OR?: ListingWhereInput[];
      NOT?: ListingWhereInput | ListingWhereInput[];
      title?: StringFilter<'Listing'> | string;
      description?: StringFilter<'Listing'> | string;
      price?: FloatFilter<'Listing'> | number;
      condition?: EnumConditionFilter<'Listing'> | $Enums.Condition;
      category?: EnumCategoryFilter<'Listing'> | $Enums.Category;
      images?: StringNullableListFilter<'Listing'>;
      sellerId?: StringFilter<'Listing'> | string;
      status?: EnumListingStatusFilter<'Listing'> | $Enums.ListingStatus;
      createdAt?: DateTimeFilter<'Listing'> | Date | string;
      updatedAt?: DateTimeFilter<'Listing'> | Date | string;
      seller?: XOR<UserScalarRelationFilter, UserWhereInput>;
      messages?: MessageListRelationFilter;
    },
    'id'
  >;

  export type ListingOrderByWithAggregationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    condition?: SortOrder;
    category?: SortOrder;
    images?: SortOrder;
    sellerId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ListingCountOrderByAggregateInput;
    _avg?: ListingAvgOrderByAggregateInput;
    _max?: ListingMaxOrderByAggregateInput;
    _min?: ListingMinOrderByAggregateInput;
    _sum?: ListingSumOrderByAggregateInput;
  };

  export type ListingScalarWhereWithAggregatesInput = {
    AND?:
      | ListingScalarWhereWithAggregatesInput
      | ListingScalarWhereWithAggregatesInput[];
    OR?: ListingScalarWhereWithAggregatesInput[];
    NOT?:
      | ListingScalarWhereWithAggregatesInput
      | ListingScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Listing'> | string;
    title?: StringWithAggregatesFilter<'Listing'> | string;
    description?: StringWithAggregatesFilter<'Listing'> | string;
    price?: FloatWithAggregatesFilter<'Listing'> | number;
    condition?: EnumConditionWithAggregatesFilter<'Listing'> | $Enums.Condition;
    category?: EnumCategoryWithAggregatesFilter<'Listing'> | $Enums.Category;
    images?: StringNullableListFilter<'Listing'>;
    sellerId?: StringWithAggregatesFilter<'Listing'> | string;
    status?:
      | EnumListingStatusWithAggregatesFilter<'Listing'>
      | $Enums.ListingStatus;
    createdAt?: DateTimeWithAggregatesFilter<'Listing'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Listing'> | Date | string;
  };

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[];
    OR?: MessageWhereInput[];
    NOT?: MessageWhereInput | MessageWhereInput[];
    id?: StringFilter<'Message'> | string;
    content?: StringFilter<'Message'> | string;
    senderId?: StringFilter<'Message'> | string;
    listingId?: StringFilter<'Message'> | string;
    createdAt?: DateTimeFilter<'Message'> | Date | string;
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>;
    listing?: XOR<ListingScalarRelationFilter, ListingWhereInput>;
  };

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder;
    content?: SortOrder;
    senderId?: SortOrder;
    listingId?: SortOrder;
    createdAt?: SortOrder;
    sender?: UserOrderByWithRelationInput;
    listing?: ListingOrderByWithRelationInput;
  };

  export type MessageWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MessageWhereInput | MessageWhereInput[];
      OR?: MessageWhereInput[];
      NOT?: MessageWhereInput | MessageWhereInput[];
      content?: StringFilter<'Message'> | string;
      senderId?: StringFilter<'Message'> | string;
      listingId?: StringFilter<'Message'> | string;
      createdAt?: DateTimeFilter<'Message'> | Date | string;
      sender?: XOR<UserScalarRelationFilter, UserWhereInput>;
      listing?: XOR<ListingScalarRelationFilter, ListingWhereInput>;
    },
    'id'
  >;

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder;
    content?: SortOrder;
    senderId?: SortOrder;
    listingId?: SortOrder;
    createdAt?: SortOrder;
    _count?: MessageCountOrderByAggregateInput;
    _max?: MessageMaxOrderByAggregateInput;
    _min?: MessageMinOrderByAggregateInput;
  };

  export type MessageScalarWhereWithAggregatesInput = {
    AND?:
      | MessageScalarWhereWithAggregatesInput
      | MessageScalarWhereWithAggregatesInput[];
    OR?: MessageScalarWhereWithAggregatesInput[];
    NOT?:
      | MessageScalarWhereWithAggregatesInput
      | MessageScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Message'> | string;
    content?: StringWithAggregatesFilter<'Message'> | string;
    senderId?: StringWithAggregatesFilter<'Message'> | string;
    listingId?: StringWithAggregatesFilter<'Message'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Message'> | Date | string;
  };

  export type StudyMaterialWhereInput = {
    AND?: StudyMaterialWhereInput | StudyMaterialWhereInput[];
    OR?: StudyMaterialWhereInput[];
    NOT?: StudyMaterialWhereInput | StudyMaterialWhereInput[];
    id?: StringFilter<'StudyMaterial'> | string;
    title?: StringFilter<'StudyMaterial'> | string;
    description?: StringFilter<'StudyMaterial'> | string;
    subject?: StringFilter<'StudyMaterial'> | string;
    type?: EnumMaterialTypeFilter<'StudyMaterial'> | $Enums.MaterialType;
    file?: StringFilter<'StudyMaterial'> | string;
    uploaderId?: StringFilter<'StudyMaterial'> | string;
    createdAt?: DateTimeFilter<'StudyMaterial'> | Date | string;
    updatedAt?: DateTimeFilter<'StudyMaterial'> | Date | string;
    versions?: MaterialVersionListRelationFilter;
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type StudyMaterialOrderByWithRelationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    subject?: SortOrder;
    type?: SortOrder;
    file?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    versions?: MaterialVersionOrderByRelationAggregateInput;
    uploader?: UserOrderByWithRelationInput;
  };

  export type StudyMaterialWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: StudyMaterialWhereInput | StudyMaterialWhereInput[];
      OR?: StudyMaterialWhereInput[];
      NOT?: StudyMaterialWhereInput | StudyMaterialWhereInput[];
      title?: StringFilter<'StudyMaterial'> | string;
      description?: StringFilter<'StudyMaterial'> | string;
      subject?: StringFilter<'StudyMaterial'> | string;
      type?: EnumMaterialTypeFilter<'StudyMaterial'> | $Enums.MaterialType;
      file?: StringFilter<'StudyMaterial'> | string;
      uploaderId?: StringFilter<'StudyMaterial'> | string;
      createdAt?: DateTimeFilter<'StudyMaterial'> | Date | string;
      updatedAt?: DateTimeFilter<'StudyMaterial'> | Date | string;
      versions?: MaterialVersionListRelationFilter;
      uploader?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type StudyMaterialOrderByWithAggregationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    subject?: SortOrder;
    type?: SortOrder;
    file?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: StudyMaterialCountOrderByAggregateInput;
    _max?: StudyMaterialMaxOrderByAggregateInput;
    _min?: StudyMaterialMinOrderByAggregateInput;
  };

  export type StudyMaterialScalarWhereWithAggregatesInput = {
    AND?:
      | StudyMaterialScalarWhereWithAggregatesInput
      | StudyMaterialScalarWhereWithAggregatesInput[];
    OR?: StudyMaterialScalarWhereWithAggregatesInput[];
    NOT?:
      | StudyMaterialScalarWhereWithAggregatesInput
      | StudyMaterialScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'StudyMaterial'> | string;
    title?: StringWithAggregatesFilter<'StudyMaterial'> | string;
    description?: StringWithAggregatesFilter<'StudyMaterial'> | string;
    subject?: StringWithAggregatesFilter<'StudyMaterial'> | string;
    type?:
      | EnumMaterialTypeWithAggregatesFilter<'StudyMaterial'>
      | $Enums.MaterialType;
    file?: StringWithAggregatesFilter<'StudyMaterial'> | string;
    uploaderId?: StringWithAggregatesFilter<'StudyMaterial'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'StudyMaterial'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'StudyMaterial'> | Date | string;
  };

  export type MaterialVersionWhereInput = {
    AND?: MaterialVersionWhereInput | MaterialVersionWhereInput[];
    OR?: MaterialVersionWhereInput[];
    NOT?: MaterialVersionWhereInput | MaterialVersionWhereInput[];
    id?: StringFilter<'MaterialVersion'> | string;
    version?: IntFilter<'MaterialVersion'> | number;
    file?: StringFilter<'MaterialVersion'> | string;
    materialId?: StringFilter<'MaterialVersion'> | string;
    uploaderId?: StringFilter<'MaterialVersion'> | string;
    createdAt?: DateTimeFilter<'MaterialVersion'> | Date | string;
    material?: XOR<StudyMaterialScalarRelationFilter, StudyMaterialWhereInput>;
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type MaterialVersionOrderByWithRelationInput = {
    id?: SortOrder;
    version?: SortOrder;
    file?: SortOrder;
    materialId?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    material?: StudyMaterialOrderByWithRelationInput;
    uploader?: UserOrderByWithRelationInput;
  };

  export type MaterialVersionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MaterialVersionWhereInput | MaterialVersionWhereInput[];
      OR?: MaterialVersionWhereInput[];
      NOT?: MaterialVersionWhereInput | MaterialVersionWhereInput[];
      version?: IntFilter<'MaterialVersion'> | number;
      file?: StringFilter<'MaterialVersion'> | string;
      materialId?: StringFilter<'MaterialVersion'> | string;
      uploaderId?: StringFilter<'MaterialVersion'> | string;
      createdAt?: DateTimeFilter<'MaterialVersion'> | Date | string;
      material?: XOR<
        StudyMaterialScalarRelationFilter,
        StudyMaterialWhereInput
      >;
      uploader?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type MaterialVersionOrderByWithAggregationInput = {
    id?: SortOrder;
    version?: SortOrder;
    file?: SortOrder;
    materialId?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    _count?: MaterialVersionCountOrderByAggregateInput;
    _avg?: MaterialVersionAvgOrderByAggregateInput;
    _max?: MaterialVersionMaxOrderByAggregateInput;
    _min?: MaterialVersionMinOrderByAggregateInput;
    _sum?: MaterialVersionSumOrderByAggregateInput;
  };

  export type MaterialVersionScalarWhereWithAggregatesInput = {
    AND?:
      | MaterialVersionScalarWhereWithAggregatesInput
      | MaterialVersionScalarWhereWithAggregatesInput[];
    OR?: MaterialVersionScalarWhereWithAggregatesInput[];
    NOT?:
      | MaterialVersionScalarWhereWithAggregatesInput
      | MaterialVersionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'MaterialVersion'> | string;
    version?: IntWithAggregatesFilter<'MaterialVersion'> | number;
    file?: StringWithAggregatesFilter<'MaterialVersion'> | string;
    materialId?: StringWithAggregatesFilter<'MaterialVersion'> | string;
    uploaderId?: StringWithAggregatesFilter<'MaterialVersion'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'MaterialVersion'> | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProfileCreateInput = {
    id?: string;
    college: string;
    year: number;
    major: string;
    bio?: string | null;
    avatar?: string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileCreateinterestsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutProfileInput;
  };

  export type ProfileUncheckedCreateInput = {
    id?: string;
    userId: string;
    college: string;
    year: number;
    major: string;
    bio?: string | null;
    avatar?: string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileCreateinterestsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    college?: StringFieldUpdateOperationsInput | string;
    year?: IntFieldUpdateOperationsInput | number;
    major?: StringFieldUpdateOperationsInput | string;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: NullableStringFieldUpdateOperationsInput | string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileUpdateinterestsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutProfileNestedInput;
  };

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    college?: StringFieldUpdateOperationsInput | string;
    year?: IntFieldUpdateOperationsInput | number;
    major?: StringFieldUpdateOperationsInput | string;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: NullableStringFieldUpdateOperationsInput | string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileUpdateinterestsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProfileCreateManyInput = {
    id?: string;
    userId: string;
    college: string;
    year: number;
    major: string;
    bio?: string | null;
    avatar?: string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileCreateinterestsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    college?: StringFieldUpdateOperationsInput | string;
    year?: IntFieldUpdateOperationsInput | number;
    major?: StringFieldUpdateOperationsInput | string;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: NullableStringFieldUpdateOperationsInput | string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileUpdateinterestsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    college?: StringFieldUpdateOperationsInput | string;
    year?: IntFieldUpdateOperationsInput | number;
    major?: StringFieldUpdateOperationsInput | string;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: NullableStringFieldUpdateOperationsInput | string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileUpdateinterestsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubCreateInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: ClubMemberCreateNestedManyWithoutClubInput;
    events?: EventCreateNestedManyWithoutClubInput;
  };

  export type ClubUncheckedCreateInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: ClubMemberUncheckedCreateNestedManyWithoutClubInput;
    events?: EventUncheckedCreateNestedManyWithoutClubInput;
  };

  export type ClubUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    members?: ClubMemberUpdateManyWithoutClubNestedInput;
    events?: EventUpdateManyWithoutClubNestedInput;
  };

  export type ClubUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    members?: ClubMemberUncheckedUpdateManyWithoutClubNestedInput;
    events?: EventUncheckedUpdateManyWithoutClubNestedInput;
  };

  export type ClubCreateManyInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ClubUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberCreateInput = {
    id?: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
    user: UserCreateNestedOneWithoutClubMembersInput;
    club: ClubCreateNestedOneWithoutMembersInput;
  };

  export type ClubMemberUncheckedCreateInput = {
    id?: string;
    userId: string;
    clubId: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
  };

  export type ClubMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutClubMembersNestedInput;
    club?: ClubUpdateOneRequiredWithoutMembersNestedInput;
  };

  export type ClubMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    clubId?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberCreateManyInput = {
    id?: string;
    userId: string;
    clubId: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
  };

  export type ClubMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    clubId?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventCreateInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club?: ClubCreateNestedOneWithoutEventsInput;
    attendees?: EventAttendeeCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    clubId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendees?: EventAttendeeUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    club?: ClubUpdateOneWithoutEventsNestedInput;
    attendees?: EventAttendeeUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    clubId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendees?: EventAttendeeUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventCreateManyInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    clubId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    clubId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventAttendeeCreateInput = {
    id?: string;
    status: $Enums.RSVPStatus;
    user: UserCreateNestedOneWithoutEventAttendeesInput;
    event: EventCreateNestedOneWithoutAttendeesInput;
  };

  export type EventAttendeeUncheckedCreateInput = {
    id?: string;
    userId: string;
    eventId: string;
    status: $Enums.RSVPStatus;
  };

  export type EventAttendeeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
    user?: UserUpdateOneRequiredWithoutEventAttendeesNestedInput;
    event?: EventUpdateOneRequiredWithoutAttendeesNestedInput;
  };

  export type EventAttendeeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type EventAttendeeCreateManyInput = {
    id?: string;
    userId: string;
    eventId: string;
    status: $Enums.RSVPStatus;
  };

  export type EventAttendeeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type EventAttendeeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type ListingCreateInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    seller: UserCreateNestedOneWithoutListingsInput;
    messages?: MessageCreateNestedManyWithoutListingInput;
  };

  export type ListingUncheckedCreateInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    sellerId: string;
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    messages?: MessageUncheckedCreateNestedManyWithoutListingInput;
  };

  export type ListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput;
    messages?: MessageUpdateManyWithoutListingNestedInput;
  };

  export type ListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    sellerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: MessageUncheckedUpdateManyWithoutListingNestedInput;
  };

  export type ListingCreateManyInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    sellerId: string;
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    sellerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageCreateInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    sender: UserCreateNestedOneWithoutMessagesInput;
    listing: ListingCreateNestedOneWithoutMessagesInput;
  };

  export type MessageUncheckedCreateInput = {
    id?: string;
    content: string;
    senderId: string;
    listingId: string;
    createdAt?: Date | string;
  };

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput;
    listing?: ListingUpdateOneRequiredWithoutMessagesNestedInput;
  };

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    listingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageCreateManyInput = {
    id?: string;
    content: string;
    senderId: string;
    listingId: string;
    createdAt?: Date | string;
  };

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    listingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StudyMaterialCreateInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    versions?: MaterialVersionCreateNestedManyWithoutMaterialInput;
    uploader: UserCreateNestedOneWithoutMaterialsInput;
  };

  export type StudyMaterialUncheckedCreateInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    uploaderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    versions?: MaterialVersionUncheckedCreateNestedManyWithoutMaterialInput;
  };

  export type StudyMaterialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    versions?: MaterialVersionUpdateManyWithoutMaterialNestedInput;
    uploader?: UserUpdateOneRequiredWithoutMaterialsNestedInput;
  };

  export type StudyMaterialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    versions?: MaterialVersionUncheckedUpdateManyWithoutMaterialNestedInput;
  };

  export type StudyMaterialCreateManyInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    uploaderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type StudyMaterialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StudyMaterialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionCreateInput = {
    id?: string;
    version: number;
    file: string;
    createdAt?: Date | string;
    material: StudyMaterialCreateNestedOneWithoutVersionsInput;
    uploader: UserCreateNestedOneWithoutMaterialVersionsInput;
  };

  export type MaterialVersionUncheckedCreateInput = {
    id?: string;
    version: number;
    file: string;
    materialId: string;
    uploaderId: string;
    createdAt?: Date | string;
  };

  export type MaterialVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    material?: StudyMaterialUpdateOneRequiredWithoutVersionsNestedInput;
    uploader?: UserUpdateOneRequiredWithoutMaterialVersionsNestedInput;
  };

  export type MaterialVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    materialId?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionCreateManyInput = {
    id?: string;
    version: number;
    file: string;
    materialId: string;
    uploaderId: string;
    createdAt?: Date | string;
  };

  export type MaterialVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    materialId?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null;
    isNot?: ProfileWhereInput | null;
  };

  export type ClubMemberListRelationFilter = {
    every?: ClubMemberWhereInput;
    some?: ClubMemberWhereInput;
    none?: ClubMemberWhereInput;
  };

  export type EventAttendeeListRelationFilter = {
    every?: EventAttendeeWhereInput;
    some?: EventAttendeeWhereInput;
    none?: EventAttendeeWhereInput;
  };

  export type ListingListRelationFilter = {
    every?: ListingWhereInput;
    some?: ListingWhereInput;
    none?: ListingWhereInput;
  };

  export type MessageListRelationFilter = {
    every?: MessageWhereInput;
    some?: MessageWhereInput;
    none?: MessageWhereInput;
  };

  export type StudyMaterialListRelationFilter = {
    every?: StudyMaterialWhereInput;
    some?: StudyMaterialWhereInput;
    none?: StudyMaterialWhereInput;
  };

  export type MaterialVersionListRelationFilter = {
    every?: MaterialVersionWhereInput;
    some?: MaterialVersionWhereInput;
    none?: MaterialVersionWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type ClubMemberOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type EventAttendeeOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ListingOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type StudyMaterialOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type MaterialVersionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    role?: SortOrder;
    verified?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    role?: SortOrder;
    verified?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    role?: SortOrder;
    verified?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumUserRoleWithAggregatesFilter<$PrismaModel>
      | $Enums.UserRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: NestedEnumUserRoleFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    college?: SortOrder;
    year?: SortOrder;
    major?: SortOrder;
    bio?: SortOrder;
    avatar?: SortOrder;
    social?: SortOrder;
    interests?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProfileAvgOrderByAggregateInput = {
    year?: SortOrder;
  };

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    college?: SortOrder;
    year?: SortOrder;
    major?: SortOrder;
    bio?: SortOrder;
    avatar?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    college?: SortOrder;
    year?: SortOrder;
    major?: SortOrder;
    bio?: SortOrder;
    avatar?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProfileSumOrderByAggregateInput = {
    year?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          'path'
        >
      >;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
  };

  export type EventListRelationFilter = {
    every?: EventWhereInput;
    some?: EventWhereInput;
    none?: EventWhereInput;
  };

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ClubCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    cover?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ClubMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    cover?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ClubMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    cover?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumClubRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ClubRole | EnumClubRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumClubRoleFilter<$PrismaModel> | $Enums.ClubRole;
  };

  export type ClubScalarRelationFilter = {
    is?: ClubWhereInput;
    isNot?: ClubWhereInput;
  };

  export type ClubMemberUserIdClubIdCompoundUniqueInput = {
    userId: string;
    clubId: string;
  };

  export type ClubMemberCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    clubId?: SortOrder;
    role?: SortOrder;
    joinedAt?: SortOrder;
  };

  export type ClubMemberMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    clubId?: SortOrder;
    role?: SortOrder;
    joinedAt?: SortOrder;
  };

  export type ClubMemberMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    clubId?: SortOrder;
    role?: SortOrder;
    joinedAt?: SortOrder;
  };

  export type EnumClubRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClubRole | EnumClubRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumClubRoleWithAggregatesFilter<$PrismaModel>
      | $Enums.ClubRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumClubRoleFilter<$PrismaModel>;
    _max?: NestedEnumClubRoleFilter<$PrismaModel>;
  };

  export type ClubNullableScalarRelationFilter = {
    is?: ClubWhereInput | null;
    isNot?: ClubWhereInput | null;
  };

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    location?: SortOrder;
    clubId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    location?: SortOrder;
    clubId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    location?: SortOrder;
    clubId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumRSVPStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RSVPStatus | EnumRSVPStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumRSVPStatusFilter<$PrismaModel> | $Enums.RSVPStatus;
  };

  export type EventScalarRelationFilter = {
    is?: EventWhereInput;
    isNot?: EventWhereInput;
  };

  export type EventAttendeeUserIdEventIdCompoundUniqueInput = {
    userId: string;
    eventId: string;
  };

  export type EventAttendeeCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
    status?: SortOrder;
  };

  export type EventAttendeeMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
    status?: SortOrder;
  };

  export type EventAttendeeMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
    status?: SortOrder;
  };

  export type EnumRSVPStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RSVPStatus | EnumRSVPStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumRSVPStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.RSVPStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumRSVPStatusFilter<$PrismaModel>;
    _max?: NestedEnumRSVPStatusFilter<$PrismaModel>;
  };

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type EnumConditionFilter<$PrismaModel = never> = {
    equals?: $Enums.Condition | EnumConditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    not?: NestedEnumConditionFilter<$PrismaModel> | $Enums.Condition;
  };

  export type EnumCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    not?: NestedEnumCategoryFilter<$PrismaModel> | $Enums.Category;
  };

  export type EnumListingStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.ListingStatus
      | EnumListingStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus;
  };

  export type ListingCountOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    condition?: SortOrder;
    category?: SortOrder;
    images?: SortOrder;
    sellerId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ListingAvgOrderByAggregateInput = {
    price?: SortOrder;
  };

  export type ListingMaxOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    condition?: SortOrder;
    category?: SortOrder;
    sellerId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ListingMinOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    condition?: SortOrder;
    category?: SortOrder;
    sellerId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ListingSumOrderByAggregateInput = {
    price?: SortOrder;
  };

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type EnumConditionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Condition | EnumConditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumConditionWithAggregatesFilter<$PrismaModel>
      | $Enums.Condition;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumConditionFilter<$PrismaModel>;
    _max?: NestedEnumConditionFilter<$PrismaModel>;
  };

  export type EnumCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumCategoryWithAggregatesFilter<$PrismaModel>
      | $Enums.Category;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumCategoryFilter<$PrismaModel>;
    _max?: NestedEnumCategoryFilter<$PrismaModel>;
  };

  export type EnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.ListingStatus
      | EnumListingStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumListingStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.ListingStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumListingStatusFilter<$PrismaModel>;
    _max?: NestedEnumListingStatusFilter<$PrismaModel>;
  };

  export type ListingScalarRelationFilter = {
    is?: ListingWhereInput;
    isNot?: ListingWhereInput;
  };

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    senderId?: SortOrder;
    listingId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    senderId?: SortOrder;
    listingId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    senderId?: SortOrder;
    listingId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumMaterialTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.MaterialType[]
      | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.MaterialType[]
      | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumMaterialTypeFilter<$PrismaModel> | $Enums.MaterialType;
  };

  export type StudyMaterialCountOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    subject?: SortOrder;
    type?: SortOrder;
    file?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StudyMaterialMaxOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    subject?: SortOrder;
    type?: SortOrder;
    file?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StudyMaterialMinOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    subject?: SortOrder;
    type?: SortOrder;
    file?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumMaterialTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.MaterialType[]
      | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.MaterialType[]
      | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumMaterialTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.MaterialType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumMaterialTypeFilter<$PrismaModel>;
    _max?: NestedEnumMaterialTypeFilter<$PrismaModel>;
  };

  export type StudyMaterialScalarRelationFilter = {
    is?: StudyMaterialWhereInput;
    isNot?: StudyMaterialWhereInput;
  };

  export type MaterialVersionCountOrderByAggregateInput = {
    id?: SortOrder;
    version?: SortOrder;
    file?: SortOrder;
    materialId?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type MaterialVersionAvgOrderByAggregateInput = {
    version?: SortOrder;
  };

  export type MaterialVersionMaxOrderByAggregateInput = {
    id?: SortOrder;
    version?: SortOrder;
    file?: SortOrder;
    materialId?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type MaterialVersionMinOrderByAggregateInput = {
    id?: SortOrder;
    version?: SortOrder;
    file?: SortOrder;
    materialId?: SortOrder;
    uploaderId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type MaterialVersionSumOrderByAggregateInput = {
    version?: SortOrder;
  };

  export type ProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    connect?: ProfileWhereUniqueInput;
  };

  export type ClubMemberCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutUserInput,
          ClubMemberUncheckedCreateWithoutUserInput
        >
      | ClubMemberCreateWithoutUserInput[]
      | ClubMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutUserInput
      | ClubMemberCreateOrConnectWithoutUserInput[];
    createMany?: ClubMemberCreateManyUserInputEnvelope;
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
  };

  export type EventAttendeeCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutUserInput,
          EventAttendeeUncheckedCreateWithoutUserInput
        >
      | EventAttendeeCreateWithoutUserInput[]
      | EventAttendeeUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutUserInput
      | EventAttendeeCreateOrConnectWithoutUserInput[];
    createMany?: EventAttendeeCreateManyUserInputEnvelope;
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
  };

  export type ListingCreateNestedManyWithoutSellerInput = {
    create?:
      | XOR<
          ListingCreateWithoutSellerInput,
          ListingUncheckedCreateWithoutSellerInput
        >
      | ListingCreateWithoutSellerInput[]
      | ListingUncheckedCreateWithoutSellerInput[];
    connectOrCreate?:
      | ListingCreateOrConnectWithoutSellerInput
      | ListingCreateOrConnectWithoutSellerInput[];
    createMany?: ListingCreateManySellerInputEnvelope;
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
  };

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type StudyMaterialCreateNestedManyWithoutUploaderInput = {
    create?:
      | XOR<
          StudyMaterialCreateWithoutUploaderInput,
          StudyMaterialUncheckedCreateWithoutUploaderInput
        >
      | StudyMaterialCreateWithoutUploaderInput[]
      | StudyMaterialUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | StudyMaterialCreateOrConnectWithoutUploaderInput
      | StudyMaterialCreateOrConnectWithoutUploaderInput[];
    createMany?: StudyMaterialCreateManyUploaderInputEnvelope;
    connect?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
  };

  export type MaterialVersionCreateNestedManyWithoutUploaderInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutUploaderInput,
          MaterialVersionUncheckedCreateWithoutUploaderInput
        >
      | MaterialVersionCreateWithoutUploaderInput[]
      | MaterialVersionUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutUploaderInput
      | MaterialVersionCreateOrConnectWithoutUploaderInput[];
    createMany?: MaterialVersionCreateManyUploaderInputEnvelope;
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
  };

  export type ProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    connect?: ProfileWhereUniqueInput;
  };

  export type ClubMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutUserInput,
          ClubMemberUncheckedCreateWithoutUserInput
        >
      | ClubMemberCreateWithoutUserInput[]
      | ClubMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutUserInput
      | ClubMemberCreateOrConnectWithoutUserInput[];
    createMany?: ClubMemberCreateManyUserInputEnvelope;
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
  };

  export type EventAttendeeUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutUserInput,
          EventAttendeeUncheckedCreateWithoutUserInput
        >
      | EventAttendeeCreateWithoutUserInput[]
      | EventAttendeeUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutUserInput
      | EventAttendeeCreateOrConnectWithoutUserInput[];
    createMany?: EventAttendeeCreateManyUserInputEnvelope;
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
  };

  export type ListingUncheckedCreateNestedManyWithoutSellerInput = {
    create?:
      | XOR<
          ListingCreateWithoutSellerInput,
          ListingUncheckedCreateWithoutSellerInput
        >
      | ListingCreateWithoutSellerInput[]
      | ListingUncheckedCreateWithoutSellerInput[];
    connectOrCreate?:
      | ListingCreateOrConnectWithoutSellerInput
      | ListingCreateOrConnectWithoutSellerInput[];
    createMany?: ListingCreateManySellerInputEnvelope;
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
  };

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput = {
    create?:
      | XOR<
          StudyMaterialCreateWithoutUploaderInput,
          StudyMaterialUncheckedCreateWithoutUploaderInput
        >
      | StudyMaterialCreateWithoutUploaderInput[]
      | StudyMaterialUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | StudyMaterialCreateOrConnectWithoutUploaderInput
      | StudyMaterialCreateOrConnectWithoutUploaderInput[];
    createMany?: StudyMaterialCreateManyUploaderInputEnvelope;
    connect?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
  };

  export type MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutUploaderInput,
          MaterialVersionUncheckedCreateWithoutUploaderInput
        >
      | MaterialVersionCreateWithoutUploaderInput[]
      | MaterialVersionUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutUploaderInput
      | MaterialVersionCreateOrConnectWithoutUploaderInput[];
    createMany?: MaterialVersionCreateManyUploaderInputEnvelope;
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type ProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    upsert?: ProfileUpsertWithoutUserInput;
    disconnect?: ProfileWhereInput | boolean;
    delete?: ProfileWhereInput | boolean;
    connect?: ProfileWhereUniqueInput;
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutUserInput,
        ProfileUpdateWithoutUserInput
      >,
      ProfileUncheckedUpdateWithoutUserInput
    >;
  };

  export type ClubMemberUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutUserInput,
          ClubMemberUncheckedCreateWithoutUserInput
        >
      | ClubMemberCreateWithoutUserInput[]
      | ClubMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutUserInput
      | ClubMemberCreateOrConnectWithoutUserInput[];
    upsert?:
      | ClubMemberUpsertWithWhereUniqueWithoutUserInput
      | ClubMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ClubMemberCreateManyUserInputEnvelope;
    set?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    disconnect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    delete?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    update?:
      | ClubMemberUpdateWithWhereUniqueWithoutUserInput
      | ClubMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ClubMemberUpdateManyWithWhereWithoutUserInput
      | ClubMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ClubMemberScalarWhereInput | ClubMemberScalarWhereInput[];
  };

  export type EventAttendeeUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutUserInput,
          EventAttendeeUncheckedCreateWithoutUserInput
        >
      | EventAttendeeCreateWithoutUserInput[]
      | EventAttendeeUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutUserInput
      | EventAttendeeCreateOrConnectWithoutUserInput[];
    upsert?:
      | EventAttendeeUpsertWithWhereUniqueWithoutUserInput
      | EventAttendeeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: EventAttendeeCreateManyUserInputEnvelope;
    set?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    disconnect?:
      | EventAttendeeWhereUniqueInput
      | EventAttendeeWhereUniqueInput[];
    delete?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    update?:
      | EventAttendeeUpdateWithWhereUniqueWithoutUserInput
      | EventAttendeeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | EventAttendeeUpdateManyWithWhereWithoutUserInput
      | EventAttendeeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | EventAttendeeScalarWhereInput
      | EventAttendeeScalarWhereInput[];
  };

  export type ListingUpdateManyWithoutSellerNestedInput = {
    create?:
      | XOR<
          ListingCreateWithoutSellerInput,
          ListingUncheckedCreateWithoutSellerInput
        >
      | ListingCreateWithoutSellerInput[]
      | ListingUncheckedCreateWithoutSellerInput[];
    connectOrCreate?:
      | ListingCreateOrConnectWithoutSellerInput
      | ListingCreateOrConnectWithoutSellerInput[];
    upsert?:
      | ListingUpsertWithWhereUniqueWithoutSellerInput
      | ListingUpsertWithWhereUniqueWithoutSellerInput[];
    createMany?: ListingCreateManySellerInputEnvelope;
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    update?:
      | ListingUpdateWithWhereUniqueWithoutSellerInput
      | ListingUpdateWithWhereUniqueWithoutSellerInput[];
    updateMany?:
      | ListingUpdateManyWithWhereWithoutSellerInput
      | ListingUpdateManyWithWhereWithoutSellerInput[];
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[];
  };

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutSenderInput
      | MessageUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutSenderInput
      | MessageUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutSenderInput
      | MessageUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type StudyMaterialUpdateManyWithoutUploaderNestedInput = {
    create?:
      | XOR<
          StudyMaterialCreateWithoutUploaderInput,
          StudyMaterialUncheckedCreateWithoutUploaderInput
        >
      | StudyMaterialCreateWithoutUploaderInput[]
      | StudyMaterialUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | StudyMaterialCreateOrConnectWithoutUploaderInput
      | StudyMaterialCreateOrConnectWithoutUploaderInput[];
    upsert?:
      | StudyMaterialUpsertWithWhereUniqueWithoutUploaderInput
      | StudyMaterialUpsertWithWhereUniqueWithoutUploaderInput[];
    createMany?: StudyMaterialCreateManyUploaderInputEnvelope;
    set?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
    disconnect?:
      | StudyMaterialWhereUniqueInput
      | StudyMaterialWhereUniqueInput[];
    delete?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
    connect?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
    update?:
      | StudyMaterialUpdateWithWhereUniqueWithoutUploaderInput
      | StudyMaterialUpdateWithWhereUniqueWithoutUploaderInput[];
    updateMany?:
      | StudyMaterialUpdateManyWithWhereWithoutUploaderInput
      | StudyMaterialUpdateManyWithWhereWithoutUploaderInput[];
    deleteMany?:
      | StudyMaterialScalarWhereInput
      | StudyMaterialScalarWhereInput[];
  };

  export type MaterialVersionUpdateManyWithoutUploaderNestedInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutUploaderInput,
          MaterialVersionUncheckedCreateWithoutUploaderInput
        >
      | MaterialVersionCreateWithoutUploaderInput[]
      | MaterialVersionUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutUploaderInput
      | MaterialVersionCreateOrConnectWithoutUploaderInput[];
    upsert?:
      | MaterialVersionUpsertWithWhereUniqueWithoutUploaderInput
      | MaterialVersionUpsertWithWhereUniqueWithoutUploaderInput[];
    createMany?: MaterialVersionCreateManyUploaderInputEnvelope;
    set?: MaterialVersionWhereUniqueInput | MaterialVersionWhereUniqueInput[];
    disconnect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    delete?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    update?:
      | MaterialVersionUpdateWithWhereUniqueWithoutUploaderInput
      | MaterialVersionUpdateWithWhereUniqueWithoutUploaderInput[];
    updateMany?:
      | MaterialVersionUpdateManyWithWhereWithoutUploaderInput
      | MaterialVersionUpdateManyWithWhereWithoutUploaderInput[];
    deleteMany?:
      | MaterialVersionScalarWhereInput
      | MaterialVersionScalarWhereInput[];
  };

  export type ProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    upsert?: ProfileUpsertWithoutUserInput;
    disconnect?: ProfileWhereInput | boolean;
    delete?: ProfileWhereInput | boolean;
    connect?: ProfileWhereUniqueInput;
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutUserInput,
        ProfileUpdateWithoutUserInput
      >,
      ProfileUncheckedUpdateWithoutUserInput
    >;
  };

  export type ClubMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutUserInput,
          ClubMemberUncheckedCreateWithoutUserInput
        >
      | ClubMemberCreateWithoutUserInput[]
      | ClubMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutUserInput
      | ClubMemberCreateOrConnectWithoutUserInput[];
    upsert?:
      | ClubMemberUpsertWithWhereUniqueWithoutUserInput
      | ClubMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ClubMemberCreateManyUserInputEnvelope;
    set?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    disconnect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    delete?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    update?:
      | ClubMemberUpdateWithWhereUniqueWithoutUserInput
      | ClubMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ClubMemberUpdateManyWithWhereWithoutUserInput
      | ClubMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ClubMemberScalarWhereInput | ClubMemberScalarWhereInput[];
  };

  export type EventAttendeeUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutUserInput,
          EventAttendeeUncheckedCreateWithoutUserInput
        >
      | EventAttendeeCreateWithoutUserInput[]
      | EventAttendeeUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutUserInput
      | EventAttendeeCreateOrConnectWithoutUserInput[];
    upsert?:
      | EventAttendeeUpsertWithWhereUniqueWithoutUserInput
      | EventAttendeeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: EventAttendeeCreateManyUserInputEnvelope;
    set?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    disconnect?:
      | EventAttendeeWhereUniqueInput
      | EventAttendeeWhereUniqueInput[];
    delete?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    update?:
      | EventAttendeeUpdateWithWhereUniqueWithoutUserInput
      | EventAttendeeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | EventAttendeeUpdateManyWithWhereWithoutUserInput
      | EventAttendeeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | EventAttendeeScalarWhereInput
      | EventAttendeeScalarWhereInput[];
  };

  export type ListingUncheckedUpdateManyWithoutSellerNestedInput = {
    create?:
      | XOR<
          ListingCreateWithoutSellerInput,
          ListingUncheckedCreateWithoutSellerInput
        >
      | ListingCreateWithoutSellerInput[]
      | ListingUncheckedCreateWithoutSellerInput[];
    connectOrCreate?:
      | ListingCreateOrConnectWithoutSellerInput
      | ListingCreateOrConnectWithoutSellerInput[];
    upsert?:
      | ListingUpsertWithWhereUniqueWithoutSellerInput
      | ListingUpsertWithWhereUniqueWithoutSellerInput[];
    createMany?: ListingCreateManySellerInputEnvelope;
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[];
    update?:
      | ListingUpdateWithWhereUniqueWithoutSellerInput
      | ListingUpdateWithWhereUniqueWithoutSellerInput[];
    updateMany?:
      | ListingUpdateManyWithWhereWithoutSellerInput
      | ListingUpdateManyWithWhereWithoutSellerInput[];
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[];
  };

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutSenderInput
      | MessageUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutSenderInput
      | MessageUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutSenderInput
      | MessageUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?:
      | XOR<
          StudyMaterialCreateWithoutUploaderInput,
          StudyMaterialUncheckedCreateWithoutUploaderInput
        >
      | StudyMaterialCreateWithoutUploaderInput[]
      | StudyMaterialUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | StudyMaterialCreateOrConnectWithoutUploaderInput
      | StudyMaterialCreateOrConnectWithoutUploaderInput[];
    upsert?:
      | StudyMaterialUpsertWithWhereUniqueWithoutUploaderInput
      | StudyMaterialUpsertWithWhereUniqueWithoutUploaderInput[];
    createMany?: StudyMaterialCreateManyUploaderInputEnvelope;
    set?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
    disconnect?:
      | StudyMaterialWhereUniqueInput
      | StudyMaterialWhereUniqueInput[];
    delete?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
    connect?: StudyMaterialWhereUniqueInput | StudyMaterialWhereUniqueInput[];
    update?:
      | StudyMaterialUpdateWithWhereUniqueWithoutUploaderInput
      | StudyMaterialUpdateWithWhereUniqueWithoutUploaderInput[];
    updateMany?:
      | StudyMaterialUpdateManyWithWhereWithoutUploaderInput
      | StudyMaterialUpdateManyWithWhereWithoutUploaderInput[];
    deleteMany?:
      | StudyMaterialScalarWhereInput
      | StudyMaterialScalarWhereInput[];
  };

  export type MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutUploaderInput,
          MaterialVersionUncheckedCreateWithoutUploaderInput
        >
      | MaterialVersionCreateWithoutUploaderInput[]
      | MaterialVersionUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutUploaderInput
      | MaterialVersionCreateOrConnectWithoutUploaderInput[];
    upsert?:
      | MaterialVersionUpsertWithWhereUniqueWithoutUploaderInput
      | MaterialVersionUpsertWithWhereUniqueWithoutUploaderInput[];
    createMany?: MaterialVersionCreateManyUploaderInputEnvelope;
    set?: MaterialVersionWhereUniqueInput | MaterialVersionWhereUniqueInput[];
    disconnect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    delete?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    update?:
      | MaterialVersionUpdateWithWhereUniqueWithoutUploaderInput
      | MaterialVersionUpdateWithWhereUniqueWithoutUploaderInput[];
    updateMany?:
      | MaterialVersionUpdateManyWithWhereWithoutUploaderInput
      | MaterialVersionUpdateManyWithWhereWithoutUploaderInput[];
    deleteMany?:
      | MaterialVersionScalarWhereInput
      | MaterialVersionScalarWhereInput[];
  };

  export type ProfileCreateinterestsInput = {
    set: string[];
  };

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput;
    connect?: UserWhereUniqueInput;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type ProfileUpdateinterestsInput = {
    set?: string[];
    push?: string | string[];
  };

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput;
    upsert?: UserUpsertWithoutProfileInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutProfileInput,
        UserUpdateWithoutProfileInput
      >,
      UserUncheckedUpdateWithoutProfileInput
    >;
  };

  export type ClubMemberCreateNestedManyWithoutClubInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutClubInput,
          ClubMemberUncheckedCreateWithoutClubInput
        >
      | ClubMemberCreateWithoutClubInput[]
      | ClubMemberUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutClubInput
      | ClubMemberCreateOrConnectWithoutClubInput[];
    createMany?: ClubMemberCreateManyClubInputEnvelope;
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
  };

  export type EventCreateNestedManyWithoutClubInput = {
    create?:
      | XOR<EventCreateWithoutClubInput, EventUncheckedCreateWithoutClubInput>
      | EventCreateWithoutClubInput[]
      | EventUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutClubInput
      | EventCreateOrConnectWithoutClubInput[];
    createMany?: EventCreateManyClubInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type ClubMemberUncheckedCreateNestedManyWithoutClubInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutClubInput,
          ClubMemberUncheckedCreateWithoutClubInput
        >
      | ClubMemberCreateWithoutClubInput[]
      | ClubMemberUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutClubInput
      | ClubMemberCreateOrConnectWithoutClubInput[];
    createMany?: ClubMemberCreateManyClubInputEnvelope;
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
  };

  export type EventUncheckedCreateNestedManyWithoutClubInput = {
    create?:
      | XOR<EventCreateWithoutClubInput, EventUncheckedCreateWithoutClubInput>
      | EventCreateWithoutClubInput[]
      | EventUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutClubInput
      | EventCreateOrConnectWithoutClubInput[];
    createMany?: EventCreateManyClubInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type ClubMemberUpdateManyWithoutClubNestedInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutClubInput,
          ClubMemberUncheckedCreateWithoutClubInput
        >
      | ClubMemberCreateWithoutClubInput[]
      | ClubMemberUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutClubInput
      | ClubMemberCreateOrConnectWithoutClubInput[];
    upsert?:
      | ClubMemberUpsertWithWhereUniqueWithoutClubInput
      | ClubMemberUpsertWithWhereUniqueWithoutClubInput[];
    createMany?: ClubMemberCreateManyClubInputEnvelope;
    set?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    disconnect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    delete?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    update?:
      | ClubMemberUpdateWithWhereUniqueWithoutClubInput
      | ClubMemberUpdateWithWhereUniqueWithoutClubInput[];
    updateMany?:
      | ClubMemberUpdateManyWithWhereWithoutClubInput
      | ClubMemberUpdateManyWithWhereWithoutClubInput[];
    deleteMany?: ClubMemberScalarWhereInput | ClubMemberScalarWhereInput[];
  };

  export type EventUpdateManyWithoutClubNestedInput = {
    create?:
      | XOR<EventCreateWithoutClubInput, EventUncheckedCreateWithoutClubInput>
      | EventCreateWithoutClubInput[]
      | EventUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutClubInput
      | EventCreateOrConnectWithoutClubInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutClubInput
      | EventUpsertWithWhereUniqueWithoutClubInput[];
    createMany?: EventCreateManyClubInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutClubInput
      | EventUpdateWithWhereUniqueWithoutClubInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutClubInput
      | EventUpdateManyWithWhereWithoutClubInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type ClubMemberUncheckedUpdateManyWithoutClubNestedInput = {
    create?:
      | XOR<
          ClubMemberCreateWithoutClubInput,
          ClubMemberUncheckedCreateWithoutClubInput
        >
      | ClubMemberCreateWithoutClubInput[]
      | ClubMemberUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | ClubMemberCreateOrConnectWithoutClubInput
      | ClubMemberCreateOrConnectWithoutClubInput[];
    upsert?:
      | ClubMemberUpsertWithWhereUniqueWithoutClubInput
      | ClubMemberUpsertWithWhereUniqueWithoutClubInput[];
    createMany?: ClubMemberCreateManyClubInputEnvelope;
    set?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    disconnect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    delete?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    connect?: ClubMemberWhereUniqueInput | ClubMemberWhereUniqueInput[];
    update?:
      | ClubMemberUpdateWithWhereUniqueWithoutClubInput
      | ClubMemberUpdateWithWhereUniqueWithoutClubInput[];
    updateMany?:
      | ClubMemberUpdateManyWithWhereWithoutClubInput
      | ClubMemberUpdateManyWithWhereWithoutClubInput[];
    deleteMany?: ClubMemberScalarWhereInput | ClubMemberScalarWhereInput[];
  };

  export type EventUncheckedUpdateManyWithoutClubNestedInput = {
    create?:
      | XOR<EventCreateWithoutClubInput, EventUncheckedCreateWithoutClubInput>
      | EventCreateWithoutClubInput[]
      | EventUncheckedCreateWithoutClubInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutClubInput
      | EventCreateOrConnectWithoutClubInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutClubInput
      | EventUpsertWithWhereUniqueWithoutClubInput[];
    createMany?: EventCreateManyClubInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutClubInput
      | EventUpdateWithWhereUniqueWithoutClubInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutClubInput
      | EventUpdateManyWithWhereWithoutClubInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutClubMembersInput = {
    create?: XOR<
      UserCreateWithoutClubMembersInput,
      UserUncheckedCreateWithoutClubMembersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutClubMembersInput;
    connect?: UserWhereUniqueInput;
  };

  export type ClubCreateNestedOneWithoutMembersInput = {
    create?: XOR<
      ClubCreateWithoutMembersInput,
      ClubUncheckedCreateWithoutMembersInput
    >;
    connectOrCreate?: ClubCreateOrConnectWithoutMembersInput;
    connect?: ClubWhereUniqueInput;
  };

  export type EnumClubRoleFieldUpdateOperationsInput = {
    set?: $Enums.ClubRole;
  };

  export type UserUpdateOneRequiredWithoutClubMembersNestedInput = {
    create?: XOR<
      UserCreateWithoutClubMembersInput,
      UserUncheckedCreateWithoutClubMembersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutClubMembersInput;
    upsert?: UserUpsertWithoutClubMembersInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutClubMembersInput,
        UserUpdateWithoutClubMembersInput
      >,
      UserUncheckedUpdateWithoutClubMembersInput
    >;
  };

  export type ClubUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<
      ClubCreateWithoutMembersInput,
      ClubUncheckedCreateWithoutMembersInput
    >;
    connectOrCreate?: ClubCreateOrConnectWithoutMembersInput;
    upsert?: ClubUpsertWithoutMembersInput;
    connect?: ClubWhereUniqueInput;
    update?: XOR<
      XOR<
        ClubUpdateToOneWithWhereWithoutMembersInput,
        ClubUpdateWithoutMembersInput
      >,
      ClubUncheckedUpdateWithoutMembersInput
    >;
  };

  export type ClubCreateNestedOneWithoutEventsInput = {
    create?: XOR<
      ClubCreateWithoutEventsInput,
      ClubUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: ClubCreateOrConnectWithoutEventsInput;
    connect?: ClubWhereUniqueInput;
  };

  export type EventAttendeeCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutEventInput,
          EventAttendeeUncheckedCreateWithoutEventInput
        >
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[];
    createMany?: EventAttendeeCreateManyEventInputEnvelope;
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
  };

  export type EventAttendeeUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutEventInput,
          EventAttendeeUncheckedCreateWithoutEventInput
        >
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[];
    createMany?: EventAttendeeCreateManyEventInputEnvelope;
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
  };

  export type ClubUpdateOneWithoutEventsNestedInput = {
    create?: XOR<
      ClubCreateWithoutEventsInput,
      ClubUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: ClubCreateOrConnectWithoutEventsInput;
    upsert?: ClubUpsertWithoutEventsInput;
    disconnect?: ClubWhereInput | boolean;
    delete?: ClubWhereInput | boolean;
    connect?: ClubWhereUniqueInput;
    update?: XOR<
      XOR<
        ClubUpdateToOneWithWhereWithoutEventsInput,
        ClubUpdateWithoutEventsInput
      >,
      ClubUncheckedUpdateWithoutEventsInput
    >;
  };

  export type EventAttendeeUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutEventInput,
          EventAttendeeUncheckedCreateWithoutEventInput
        >
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[];
    upsert?:
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: EventAttendeeCreateManyEventInputEnvelope;
    set?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    disconnect?:
      | EventAttendeeWhereUniqueInput
      | EventAttendeeWhereUniqueInput[];
    delete?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    update?:
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | EventAttendeeUpdateManyWithWhereWithoutEventInput
      | EventAttendeeUpdateManyWithWhereWithoutEventInput[];
    deleteMany?:
      | EventAttendeeScalarWhereInput
      | EventAttendeeScalarWhereInput[];
  };

  export type EventAttendeeUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<
          EventAttendeeCreateWithoutEventInput,
          EventAttendeeUncheckedCreateWithoutEventInput
        >
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[];
    upsert?:
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: EventAttendeeCreateManyEventInputEnvelope;
    set?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    disconnect?:
      | EventAttendeeWhereUniqueInput
      | EventAttendeeWhereUniqueInput[];
    delete?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[];
    update?:
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | EventAttendeeUpdateManyWithWhereWithoutEventInput
      | EventAttendeeUpdateManyWithWhereWithoutEventInput[];
    deleteMany?:
      | EventAttendeeScalarWhereInput
      | EventAttendeeScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutEventAttendeesInput = {
    create?: XOR<
      UserCreateWithoutEventAttendeesInput,
      UserUncheckedCreateWithoutEventAttendeesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEventAttendeesInput;
    connect?: UserWhereUniqueInput;
  };

  export type EventCreateNestedOneWithoutAttendeesInput = {
    create?: XOR<
      EventCreateWithoutAttendeesInput,
      EventUncheckedCreateWithoutAttendeesInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutAttendeesInput;
    connect?: EventWhereUniqueInput;
  };

  export type EnumRSVPStatusFieldUpdateOperationsInput = {
    set?: $Enums.RSVPStatus;
  };

  export type UserUpdateOneRequiredWithoutEventAttendeesNestedInput = {
    create?: XOR<
      UserCreateWithoutEventAttendeesInput,
      UserUncheckedCreateWithoutEventAttendeesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEventAttendeesInput;
    upsert?: UserUpsertWithoutEventAttendeesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutEventAttendeesInput,
        UserUpdateWithoutEventAttendeesInput
      >,
      UserUncheckedUpdateWithoutEventAttendeesInput
    >;
  };

  export type EventUpdateOneRequiredWithoutAttendeesNestedInput = {
    create?: XOR<
      EventCreateWithoutAttendeesInput,
      EventUncheckedCreateWithoutAttendeesInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutAttendeesInput;
    upsert?: EventUpsertWithoutAttendeesInput;
    connect?: EventWhereUniqueInput;
    update?: XOR<
      XOR<
        EventUpdateToOneWithWhereWithoutAttendeesInput,
        EventUpdateWithoutAttendeesInput
      >,
      EventUncheckedUpdateWithoutAttendeesInput
    >;
  };

  export type ListingCreateimagesInput = {
    set: string[];
  };

  export type UserCreateNestedOneWithoutListingsInput = {
    create?: XOR<
      UserCreateWithoutListingsInput,
      UserUncheckedCreateWithoutListingsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutListingsInput;
    connect?: UserWhereUniqueInput;
  };

  export type MessageCreateNestedManyWithoutListingInput = {
    create?:
      | XOR<
          MessageCreateWithoutListingInput,
          MessageUncheckedCreateWithoutListingInput
        >
      | MessageCreateWithoutListingInput[]
      | MessageUncheckedCreateWithoutListingInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutListingInput
      | MessageCreateOrConnectWithoutListingInput[];
    createMany?: MessageCreateManyListingInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type MessageUncheckedCreateNestedManyWithoutListingInput = {
    create?:
      | XOR<
          MessageCreateWithoutListingInput,
          MessageUncheckedCreateWithoutListingInput
        >
      | MessageCreateWithoutListingInput[]
      | MessageUncheckedCreateWithoutListingInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutListingInput
      | MessageCreateOrConnectWithoutListingInput[];
    createMany?: MessageCreateManyListingInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type EnumConditionFieldUpdateOperationsInput = {
    set?: $Enums.Condition;
  };

  export type EnumCategoryFieldUpdateOperationsInput = {
    set?: $Enums.Category;
  };

  export type ListingUpdateimagesInput = {
    set?: string[];
    push?: string | string[];
  };

  export type EnumListingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ListingStatus;
  };

  export type UserUpdateOneRequiredWithoutListingsNestedInput = {
    create?: XOR<
      UserCreateWithoutListingsInput,
      UserUncheckedCreateWithoutListingsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutListingsInput;
    upsert?: UserUpsertWithoutListingsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutListingsInput,
        UserUpdateWithoutListingsInput
      >,
      UserUncheckedUpdateWithoutListingsInput
    >;
  };

  export type MessageUpdateManyWithoutListingNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutListingInput,
          MessageUncheckedCreateWithoutListingInput
        >
      | MessageCreateWithoutListingInput[]
      | MessageUncheckedCreateWithoutListingInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutListingInput
      | MessageCreateOrConnectWithoutListingInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutListingInput
      | MessageUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: MessageCreateManyListingInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutListingInput
      | MessageUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutListingInput
      | MessageUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type MessageUncheckedUpdateManyWithoutListingNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutListingInput,
          MessageUncheckedCreateWithoutListingInput
        >
      | MessageCreateWithoutListingInput[]
      | MessageUncheckedCreateWithoutListingInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutListingInput
      | MessageCreateOrConnectWithoutListingInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutListingInput
      | MessageUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: MessageCreateManyListingInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutListingInput
      | MessageUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutListingInput
      | MessageUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<
      UserCreateWithoutMessagesInput,
      UserUncheckedCreateWithoutMessagesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput;
    connect?: UserWhereUniqueInput;
  };

  export type ListingCreateNestedOneWithoutMessagesInput = {
    create?: XOR<
      ListingCreateWithoutMessagesInput,
      ListingUncheckedCreateWithoutMessagesInput
    >;
    connectOrCreate?: ListingCreateOrConnectWithoutMessagesInput;
    connect?: ListingWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<
      UserCreateWithoutMessagesInput,
      UserUncheckedCreateWithoutMessagesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput;
    upsert?: UserUpsertWithoutMessagesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutMessagesInput,
        UserUpdateWithoutMessagesInput
      >,
      UserUncheckedUpdateWithoutMessagesInput
    >;
  };

  export type ListingUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<
      ListingCreateWithoutMessagesInput,
      ListingUncheckedCreateWithoutMessagesInput
    >;
    connectOrCreate?: ListingCreateOrConnectWithoutMessagesInput;
    upsert?: ListingUpsertWithoutMessagesInput;
    connect?: ListingWhereUniqueInput;
    update?: XOR<
      XOR<
        ListingUpdateToOneWithWhereWithoutMessagesInput,
        ListingUpdateWithoutMessagesInput
      >,
      ListingUncheckedUpdateWithoutMessagesInput
    >;
  };

  export type MaterialVersionCreateNestedManyWithoutMaterialInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutMaterialInput,
          MaterialVersionUncheckedCreateWithoutMaterialInput
        >
      | MaterialVersionCreateWithoutMaterialInput[]
      | MaterialVersionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutMaterialInput
      | MaterialVersionCreateOrConnectWithoutMaterialInput[];
    createMany?: MaterialVersionCreateManyMaterialInputEnvelope;
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
  };

  export type UserCreateNestedOneWithoutMaterialsInput = {
    create?: XOR<
      UserCreateWithoutMaterialsInput,
      UserUncheckedCreateWithoutMaterialsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMaterialsInput;
    connect?: UserWhereUniqueInput;
  };

  export type MaterialVersionUncheckedCreateNestedManyWithoutMaterialInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutMaterialInput,
          MaterialVersionUncheckedCreateWithoutMaterialInput
        >
      | MaterialVersionCreateWithoutMaterialInput[]
      | MaterialVersionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutMaterialInput
      | MaterialVersionCreateOrConnectWithoutMaterialInput[];
    createMany?: MaterialVersionCreateManyMaterialInputEnvelope;
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
  };

  export type EnumMaterialTypeFieldUpdateOperationsInput = {
    set?: $Enums.MaterialType;
  };

  export type MaterialVersionUpdateManyWithoutMaterialNestedInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutMaterialInput,
          MaterialVersionUncheckedCreateWithoutMaterialInput
        >
      | MaterialVersionCreateWithoutMaterialInput[]
      | MaterialVersionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutMaterialInput
      | MaterialVersionCreateOrConnectWithoutMaterialInput[];
    upsert?:
      | MaterialVersionUpsertWithWhereUniqueWithoutMaterialInput
      | MaterialVersionUpsertWithWhereUniqueWithoutMaterialInput[];
    createMany?: MaterialVersionCreateManyMaterialInputEnvelope;
    set?: MaterialVersionWhereUniqueInput | MaterialVersionWhereUniqueInput[];
    disconnect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    delete?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    update?:
      | MaterialVersionUpdateWithWhereUniqueWithoutMaterialInput
      | MaterialVersionUpdateWithWhereUniqueWithoutMaterialInput[];
    updateMany?:
      | MaterialVersionUpdateManyWithWhereWithoutMaterialInput
      | MaterialVersionUpdateManyWithWhereWithoutMaterialInput[];
    deleteMany?:
      | MaterialVersionScalarWhereInput
      | MaterialVersionScalarWhereInput[];
  };

  export type UserUpdateOneRequiredWithoutMaterialsNestedInput = {
    create?: XOR<
      UserCreateWithoutMaterialsInput,
      UserUncheckedCreateWithoutMaterialsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMaterialsInput;
    upsert?: UserUpsertWithoutMaterialsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutMaterialsInput,
        UserUpdateWithoutMaterialsInput
      >,
      UserUncheckedUpdateWithoutMaterialsInput
    >;
  };

  export type MaterialVersionUncheckedUpdateManyWithoutMaterialNestedInput = {
    create?:
      | XOR<
          MaterialVersionCreateWithoutMaterialInput,
          MaterialVersionUncheckedCreateWithoutMaterialInput
        >
      | MaterialVersionCreateWithoutMaterialInput[]
      | MaterialVersionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?:
      | MaterialVersionCreateOrConnectWithoutMaterialInput
      | MaterialVersionCreateOrConnectWithoutMaterialInput[];
    upsert?:
      | MaterialVersionUpsertWithWhereUniqueWithoutMaterialInput
      | MaterialVersionUpsertWithWhereUniqueWithoutMaterialInput[];
    createMany?: MaterialVersionCreateManyMaterialInputEnvelope;
    set?: MaterialVersionWhereUniqueInput | MaterialVersionWhereUniqueInput[];
    disconnect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    delete?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    connect?:
      | MaterialVersionWhereUniqueInput
      | MaterialVersionWhereUniqueInput[];
    update?:
      | MaterialVersionUpdateWithWhereUniqueWithoutMaterialInput
      | MaterialVersionUpdateWithWhereUniqueWithoutMaterialInput[];
    updateMany?:
      | MaterialVersionUpdateManyWithWhereWithoutMaterialInput
      | MaterialVersionUpdateManyWithWhereWithoutMaterialInput[];
    deleteMany?:
      | MaterialVersionScalarWhereInput
      | MaterialVersionScalarWhereInput[];
  };

  export type StudyMaterialCreateNestedOneWithoutVersionsInput = {
    create?: XOR<
      StudyMaterialCreateWithoutVersionsInput,
      StudyMaterialUncheckedCreateWithoutVersionsInput
    >;
    connectOrCreate?: StudyMaterialCreateOrConnectWithoutVersionsInput;
    connect?: StudyMaterialWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutMaterialVersionsInput = {
    create?: XOR<
      UserCreateWithoutMaterialVersionsInput,
      UserUncheckedCreateWithoutMaterialVersionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMaterialVersionsInput;
    connect?: UserWhereUniqueInput;
  };

  export type StudyMaterialUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<
      StudyMaterialCreateWithoutVersionsInput,
      StudyMaterialUncheckedCreateWithoutVersionsInput
    >;
    connectOrCreate?: StudyMaterialCreateOrConnectWithoutVersionsInput;
    upsert?: StudyMaterialUpsertWithoutVersionsInput;
    connect?: StudyMaterialWhereUniqueInput;
    update?: XOR<
      XOR<
        StudyMaterialUpdateToOneWithWhereWithoutVersionsInput,
        StudyMaterialUpdateWithoutVersionsInput
      >,
      StudyMaterialUncheckedUpdateWithoutVersionsInput
    >;
  };

  export type UserUpdateOneRequiredWithoutMaterialVersionsNestedInput = {
    create?: XOR<
      UserCreateWithoutMaterialVersionsInput,
      UserUncheckedCreateWithoutMaterialVersionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMaterialVersionsInput;
    upsert?: UserUpsertWithoutMaterialVersionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutMaterialVersionsInput,
        UserUpdateWithoutMaterialVersionsInput
      >,
      UserUncheckedUpdateWithoutMaterialVersionsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumUserRoleWithAggregatesFilter<$PrismaModel>
      | $Enums.UserRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: NestedEnumUserRoleFilter<$PrismaModel>;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type NestedEnumClubRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ClubRole | EnumClubRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumClubRoleFilter<$PrismaModel> | $Enums.ClubRole;
  };

  export type NestedEnumClubRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClubRole | EnumClubRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClubRole[] | ListEnumClubRoleFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumClubRoleWithAggregatesFilter<$PrismaModel>
      | $Enums.ClubRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumClubRoleFilter<$PrismaModel>;
    _max?: NestedEnumClubRoleFilter<$PrismaModel>;
  };

  export type NestedEnumRSVPStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RSVPStatus | EnumRSVPStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumRSVPStatusFilter<$PrismaModel> | $Enums.RSVPStatus;
  };

  export type NestedEnumRSVPStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RSVPStatus | EnumRSVPStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RSVPStatus[] | ListEnumRSVPStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumRSVPStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.RSVPStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumRSVPStatusFilter<$PrismaModel>;
    _max?: NestedEnumRSVPStatusFilter<$PrismaModel>;
  };

  export type NestedEnumConditionFilter<$PrismaModel = never> = {
    equals?: $Enums.Condition | EnumConditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    not?: NestedEnumConditionFilter<$PrismaModel> | $Enums.Condition;
  };

  export type NestedEnumCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    not?: NestedEnumCategoryFilter<$PrismaModel> | $Enums.Category;
  };

  export type NestedEnumListingStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.ListingStatus
      | EnumListingStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus;
  };

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type NestedEnumConditionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Condition | EnumConditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Condition[] | ListEnumConditionFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumConditionWithAggregatesFilter<$PrismaModel>
      | $Enums.Condition;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumConditionFilter<$PrismaModel>;
    _max?: NestedEnumConditionFilter<$PrismaModel>;
  };

  export type NestedEnumCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumCategoryWithAggregatesFilter<$PrismaModel>
      | $Enums.Category;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumCategoryFilter<$PrismaModel>;
    _max?: NestedEnumCategoryFilter<$PrismaModel>;
  };

  export type NestedEnumListingStatusWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.ListingStatus
      | EnumListingStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ListingStatus[]
      | ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumListingStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.ListingStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumListingStatusFilter<$PrismaModel>;
    _max?: NestedEnumListingStatusFilter<$PrismaModel>;
  };

  export type NestedEnumMaterialTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.MaterialType[]
      | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.MaterialType[]
      | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumMaterialTypeFilter<$PrismaModel> | $Enums.MaterialType;
  };

  export type NestedEnumMaterialTypeWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?:
        | $Enums.MaterialType
        | EnumMaterialTypeFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.MaterialType[]
        | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.MaterialType[]
        | ListEnumMaterialTypeFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumMaterialTypeWithAggregatesFilter<$PrismaModel>
        | $Enums.MaterialType;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumMaterialTypeFilter<$PrismaModel>;
      _max?: NestedEnumMaterialTypeFilter<$PrismaModel>;
    };

  export type ProfileCreateWithoutUserInput = {
    id?: string;
    college: string;
    year: number;
    major: string;
    bio?: string | null;
    avatar?: string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileCreateinterestsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProfileUncheckedCreateWithoutUserInput = {
    id?: string;
    college: string;
    year: number;
    major: string;
    bio?: string | null;
    avatar?: string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileCreateinterestsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProfileCreateOrConnectWithoutUserInput = {
    where: ProfileWhereUniqueInput;
    create: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
  };

  export type ClubMemberCreateWithoutUserInput = {
    id?: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
    club: ClubCreateNestedOneWithoutMembersInput;
  };

  export type ClubMemberUncheckedCreateWithoutUserInput = {
    id?: string;
    clubId: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
  };

  export type ClubMemberCreateOrConnectWithoutUserInput = {
    where: ClubMemberWhereUniqueInput;
    create: XOR<
      ClubMemberCreateWithoutUserInput,
      ClubMemberUncheckedCreateWithoutUserInput
    >;
  };

  export type ClubMemberCreateManyUserInputEnvelope = {
    data: ClubMemberCreateManyUserInput | ClubMemberCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type EventAttendeeCreateWithoutUserInput = {
    id?: string;
    status: $Enums.RSVPStatus;
    event: EventCreateNestedOneWithoutAttendeesInput;
  };

  export type EventAttendeeUncheckedCreateWithoutUserInput = {
    id?: string;
    eventId: string;
    status: $Enums.RSVPStatus;
  };

  export type EventAttendeeCreateOrConnectWithoutUserInput = {
    where: EventAttendeeWhereUniqueInput;
    create: XOR<
      EventAttendeeCreateWithoutUserInput,
      EventAttendeeUncheckedCreateWithoutUserInput
    >;
  };

  export type EventAttendeeCreateManyUserInputEnvelope = {
    data: EventAttendeeCreateManyUserInput | EventAttendeeCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type ListingCreateWithoutSellerInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    messages?: MessageCreateNestedManyWithoutListingInput;
  };

  export type ListingUncheckedCreateWithoutSellerInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    messages?: MessageUncheckedCreateNestedManyWithoutListingInput;
  };

  export type ListingCreateOrConnectWithoutSellerInput = {
    where: ListingWhereUniqueInput;
    create: XOR<
      ListingCreateWithoutSellerInput,
      ListingUncheckedCreateWithoutSellerInput
    >;
  };

  export type ListingCreateManySellerInputEnvelope = {
    data: ListingCreateManySellerInput | ListingCreateManySellerInput[];
    skipDuplicates?: boolean;
  };

  export type MessageCreateWithoutSenderInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    listing: ListingCreateNestedOneWithoutMessagesInput;
  };

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string;
    content: string;
    listingId: string;
    createdAt?: Date | string;
  };

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput;
    create: XOR<
      MessageCreateWithoutSenderInput,
      MessageUncheckedCreateWithoutSenderInput
    >;
  };

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[];
    skipDuplicates?: boolean;
  };

  export type StudyMaterialCreateWithoutUploaderInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    versions?: MaterialVersionCreateNestedManyWithoutMaterialInput;
  };

  export type StudyMaterialUncheckedCreateWithoutUploaderInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    versions?: MaterialVersionUncheckedCreateNestedManyWithoutMaterialInput;
  };

  export type StudyMaterialCreateOrConnectWithoutUploaderInput = {
    where: StudyMaterialWhereUniqueInput;
    create: XOR<
      StudyMaterialCreateWithoutUploaderInput,
      StudyMaterialUncheckedCreateWithoutUploaderInput
    >;
  };

  export type StudyMaterialCreateManyUploaderInputEnvelope = {
    data:
      | StudyMaterialCreateManyUploaderInput
      | StudyMaterialCreateManyUploaderInput[];
    skipDuplicates?: boolean;
  };

  export type MaterialVersionCreateWithoutUploaderInput = {
    id?: string;
    version: number;
    file: string;
    createdAt?: Date | string;
    material: StudyMaterialCreateNestedOneWithoutVersionsInput;
  };

  export type MaterialVersionUncheckedCreateWithoutUploaderInput = {
    id?: string;
    version: number;
    file: string;
    materialId: string;
    createdAt?: Date | string;
  };

  export type MaterialVersionCreateOrConnectWithoutUploaderInput = {
    where: MaterialVersionWhereUniqueInput;
    create: XOR<
      MaterialVersionCreateWithoutUploaderInput,
      MaterialVersionUncheckedCreateWithoutUploaderInput
    >;
  };

  export type MaterialVersionCreateManyUploaderInputEnvelope = {
    data:
      | MaterialVersionCreateManyUploaderInput
      | MaterialVersionCreateManyUploaderInput[];
    skipDuplicates?: boolean;
  };

  export type ProfileUpsertWithoutUserInput = {
    update: XOR<
      ProfileUpdateWithoutUserInput,
      ProfileUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    where?: ProfileWhereInput;
  };

  export type ProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: ProfileWhereInput;
    data: XOR<
      ProfileUpdateWithoutUserInput,
      ProfileUncheckedUpdateWithoutUserInput
    >;
  };

  export type ProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    college?: StringFieldUpdateOperationsInput | string;
    year?: IntFieldUpdateOperationsInput | number;
    major?: StringFieldUpdateOperationsInput | string;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: NullableStringFieldUpdateOperationsInput | string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileUpdateinterestsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    college?: StringFieldUpdateOperationsInput | string;
    year?: IntFieldUpdateOperationsInput | number;
    major?: StringFieldUpdateOperationsInput | string;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: NullableStringFieldUpdateOperationsInput | string | null;
    social?: NullableJsonNullValueInput | InputJsonValue;
    interests?: ProfileUpdateinterestsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: ClubMemberWhereUniqueInput;
    update: XOR<
      ClubMemberUpdateWithoutUserInput,
      ClubMemberUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ClubMemberCreateWithoutUserInput,
      ClubMemberUncheckedCreateWithoutUserInput
    >;
  };

  export type ClubMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: ClubMemberWhereUniqueInput;
    data: XOR<
      ClubMemberUpdateWithoutUserInput,
      ClubMemberUncheckedUpdateWithoutUserInput
    >;
  };

  export type ClubMemberUpdateManyWithWhereWithoutUserInput = {
    where: ClubMemberScalarWhereInput;
    data: XOR<
      ClubMemberUpdateManyMutationInput,
      ClubMemberUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type ClubMemberScalarWhereInput = {
    AND?: ClubMemberScalarWhereInput | ClubMemberScalarWhereInput[];
    OR?: ClubMemberScalarWhereInput[];
    NOT?: ClubMemberScalarWhereInput | ClubMemberScalarWhereInput[];
    id?: StringFilter<'ClubMember'> | string;
    userId?: StringFilter<'ClubMember'> | string;
    clubId?: StringFilter<'ClubMember'> | string;
    role?: EnumClubRoleFilter<'ClubMember'> | $Enums.ClubRole;
    joinedAt?: DateTimeFilter<'ClubMember'> | Date | string;
  };

  export type EventAttendeeUpsertWithWhereUniqueWithoutUserInput = {
    where: EventAttendeeWhereUniqueInput;
    update: XOR<
      EventAttendeeUpdateWithoutUserInput,
      EventAttendeeUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      EventAttendeeCreateWithoutUserInput,
      EventAttendeeUncheckedCreateWithoutUserInput
    >;
  };

  export type EventAttendeeUpdateWithWhereUniqueWithoutUserInput = {
    where: EventAttendeeWhereUniqueInput;
    data: XOR<
      EventAttendeeUpdateWithoutUserInput,
      EventAttendeeUncheckedUpdateWithoutUserInput
    >;
  };

  export type EventAttendeeUpdateManyWithWhereWithoutUserInput = {
    where: EventAttendeeScalarWhereInput;
    data: XOR<
      EventAttendeeUpdateManyMutationInput,
      EventAttendeeUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type EventAttendeeScalarWhereInput = {
    AND?: EventAttendeeScalarWhereInput | EventAttendeeScalarWhereInput[];
    OR?: EventAttendeeScalarWhereInput[];
    NOT?: EventAttendeeScalarWhereInput | EventAttendeeScalarWhereInput[];
    id?: StringFilter<'EventAttendee'> | string;
    userId?: StringFilter<'EventAttendee'> | string;
    eventId?: StringFilter<'EventAttendee'> | string;
    status?: EnumRSVPStatusFilter<'EventAttendee'> | $Enums.RSVPStatus;
  };

  export type ListingUpsertWithWhereUniqueWithoutSellerInput = {
    where: ListingWhereUniqueInput;
    update: XOR<
      ListingUpdateWithoutSellerInput,
      ListingUncheckedUpdateWithoutSellerInput
    >;
    create: XOR<
      ListingCreateWithoutSellerInput,
      ListingUncheckedCreateWithoutSellerInput
    >;
  };

  export type ListingUpdateWithWhereUniqueWithoutSellerInput = {
    where: ListingWhereUniqueInput;
    data: XOR<
      ListingUpdateWithoutSellerInput,
      ListingUncheckedUpdateWithoutSellerInput
    >;
  };

  export type ListingUpdateManyWithWhereWithoutSellerInput = {
    where: ListingScalarWhereInput;
    data: XOR<
      ListingUpdateManyMutationInput,
      ListingUncheckedUpdateManyWithoutSellerInput
    >;
  };

  export type ListingScalarWhereInput = {
    AND?: ListingScalarWhereInput | ListingScalarWhereInput[];
    OR?: ListingScalarWhereInput[];
    NOT?: ListingScalarWhereInput | ListingScalarWhereInput[];
    id?: StringFilter<'Listing'> | string;
    title?: StringFilter<'Listing'> | string;
    description?: StringFilter<'Listing'> | string;
    price?: FloatFilter<'Listing'> | number;
    condition?: EnumConditionFilter<'Listing'> | $Enums.Condition;
    category?: EnumCategoryFilter<'Listing'> | $Enums.Category;
    images?: StringNullableListFilter<'Listing'>;
    sellerId?: StringFilter<'Listing'> | string;
    status?: EnumListingStatusFilter<'Listing'> | $Enums.ListingStatus;
    createdAt?: DateTimeFilter<'Listing'> | Date | string;
    updatedAt?: DateTimeFilter<'Listing'> | Date | string;
  };

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput;
    update: XOR<
      MessageUpdateWithoutSenderInput,
      MessageUncheckedUpdateWithoutSenderInput
    >;
    create: XOR<
      MessageCreateWithoutSenderInput,
      MessageUncheckedCreateWithoutSenderInput
    >;
  };

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput;
    data: XOR<
      MessageUpdateWithoutSenderInput,
      MessageUncheckedUpdateWithoutSenderInput
    >;
  };

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput;
    data: XOR<
      MessageUpdateManyMutationInput,
      MessageUncheckedUpdateManyWithoutSenderInput
    >;
  };

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[];
    OR?: MessageScalarWhereInput[];
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[];
    id?: StringFilter<'Message'> | string;
    content?: StringFilter<'Message'> | string;
    senderId?: StringFilter<'Message'> | string;
    listingId?: StringFilter<'Message'> | string;
    createdAt?: DateTimeFilter<'Message'> | Date | string;
  };

  export type StudyMaterialUpsertWithWhereUniqueWithoutUploaderInput = {
    where: StudyMaterialWhereUniqueInput;
    update: XOR<
      StudyMaterialUpdateWithoutUploaderInput,
      StudyMaterialUncheckedUpdateWithoutUploaderInput
    >;
    create: XOR<
      StudyMaterialCreateWithoutUploaderInput,
      StudyMaterialUncheckedCreateWithoutUploaderInput
    >;
  };

  export type StudyMaterialUpdateWithWhereUniqueWithoutUploaderInput = {
    where: StudyMaterialWhereUniqueInput;
    data: XOR<
      StudyMaterialUpdateWithoutUploaderInput,
      StudyMaterialUncheckedUpdateWithoutUploaderInput
    >;
  };

  export type StudyMaterialUpdateManyWithWhereWithoutUploaderInput = {
    where: StudyMaterialScalarWhereInput;
    data: XOR<
      StudyMaterialUpdateManyMutationInput,
      StudyMaterialUncheckedUpdateManyWithoutUploaderInput
    >;
  };

  export type StudyMaterialScalarWhereInput = {
    AND?: StudyMaterialScalarWhereInput | StudyMaterialScalarWhereInput[];
    OR?: StudyMaterialScalarWhereInput[];
    NOT?: StudyMaterialScalarWhereInput | StudyMaterialScalarWhereInput[];
    id?: StringFilter<'StudyMaterial'> | string;
    title?: StringFilter<'StudyMaterial'> | string;
    description?: StringFilter<'StudyMaterial'> | string;
    subject?: StringFilter<'StudyMaterial'> | string;
    type?: EnumMaterialTypeFilter<'StudyMaterial'> | $Enums.MaterialType;
    file?: StringFilter<'StudyMaterial'> | string;
    uploaderId?: StringFilter<'StudyMaterial'> | string;
    createdAt?: DateTimeFilter<'StudyMaterial'> | Date | string;
    updatedAt?: DateTimeFilter<'StudyMaterial'> | Date | string;
  };

  export type MaterialVersionUpsertWithWhereUniqueWithoutUploaderInput = {
    where: MaterialVersionWhereUniqueInput;
    update: XOR<
      MaterialVersionUpdateWithoutUploaderInput,
      MaterialVersionUncheckedUpdateWithoutUploaderInput
    >;
    create: XOR<
      MaterialVersionCreateWithoutUploaderInput,
      MaterialVersionUncheckedCreateWithoutUploaderInput
    >;
  };

  export type MaterialVersionUpdateWithWhereUniqueWithoutUploaderInput = {
    where: MaterialVersionWhereUniqueInput;
    data: XOR<
      MaterialVersionUpdateWithoutUploaderInput,
      MaterialVersionUncheckedUpdateWithoutUploaderInput
    >;
  };

  export type MaterialVersionUpdateManyWithWhereWithoutUploaderInput = {
    where: MaterialVersionScalarWhereInput;
    data: XOR<
      MaterialVersionUpdateManyMutationInput,
      MaterialVersionUncheckedUpdateManyWithoutUploaderInput
    >;
  };

  export type MaterialVersionScalarWhereInput = {
    AND?: MaterialVersionScalarWhereInput | MaterialVersionScalarWhereInput[];
    OR?: MaterialVersionScalarWhereInput[];
    NOT?: MaterialVersionScalarWhereInput | MaterialVersionScalarWhereInput[];
    id?: StringFilter<'MaterialVersion'> | string;
    version?: IntFilter<'MaterialVersion'> | number;
    file?: StringFilter<'MaterialVersion'> | string;
    materialId?: StringFilter<'MaterialVersion'> | string;
    uploaderId?: StringFilter<'MaterialVersion'> | string;
    createdAt?: DateTimeFilter<'MaterialVersion'> | Date | string;
  };

  export type UserCreateWithoutProfileInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
  };

  export type UserUpsertWithoutProfileInput = {
    update: XOR<
      UserUpdateWithoutProfileInput,
      UserUncheckedUpdateWithoutProfileInput
    >;
    create: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutProfileInput,
      UserUncheckedUpdateWithoutProfileInput
    >;
  };

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type ClubMemberCreateWithoutClubInput = {
    id?: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
    user: UserCreateNestedOneWithoutClubMembersInput;
  };

  export type ClubMemberUncheckedCreateWithoutClubInput = {
    id?: string;
    userId: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
  };

  export type ClubMemberCreateOrConnectWithoutClubInput = {
    where: ClubMemberWhereUniqueInput;
    create: XOR<
      ClubMemberCreateWithoutClubInput,
      ClubMemberUncheckedCreateWithoutClubInput
    >;
  };

  export type ClubMemberCreateManyClubInputEnvelope = {
    data: ClubMemberCreateManyClubInput | ClubMemberCreateManyClubInput[];
    skipDuplicates?: boolean;
  };

  export type EventCreateWithoutClubInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendees?: EventAttendeeCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutClubInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendees?: EventAttendeeUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutClubInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutClubInput,
      EventUncheckedCreateWithoutClubInput
    >;
  };

  export type EventCreateManyClubInputEnvelope = {
    data: EventCreateManyClubInput | EventCreateManyClubInput[];
    skipDuplicates?: boolean;
  };

  export type ClubMemberUpsertWithWhereUniqueWithoutClubInput = {
    where: ClubMemberWhereUniqueInput;
    update: XOR<
      ClubMemberUpdateWithoutClubInput,
      ClubMemberUncheckedUpdateWithoutClubInput
    >;
    create: XOR<
      ClubMemberCreateWithoutClubInput,
      ClubMemberUncheckedCreateWithoutClubInput
    >;
  };

  export type ClubMemberUpdateWithWhereUniqueWithoutClubInput = {
    where: ClubMemberWhereUniqueInput;
    data: XOR<
      ClubMemberUpdateWithoutClubInput,
      ClubMemberUncheckedUpdateWithoutClubInput
    >;
  };

  export type ClubMemberUpdateManyWithWhereWithoutClubInput = {
    where: ClubMemberScalarWhereInput;
    data: XOR<
      ClubMemberUpdateManyMutationInput,
      ClubMemberUncheckedUpdateManyWithoutClubInput
    >;
  };

  export type EventUpsertWithWhereUniqueWithoutClubInput = {
    where: EventWhereUniqueInput;
    update: XOR<
      EventUpdateWithoutClubInput,
      EventUncheckedUpdateWithoutClubInput
    >;
    create: XOR<
      EventCreateWithoutClubInput,
      EventUncheckedCreateWithoutClubInput
    >;
  };

  export type EventUpdateWithWhereUniqueWithoutClubInput = {
    where: EventWhereUniqueInput;
    data: XOR<
      EventUpdateWithoutClubInput,
      EventUncheckedUpdateWithoutClubInput
    >;
  };

  export type EventUpdateManyWithWhereWithoutClubInput = {
    where: EventScalarWhereInput;
    data: XOR<
      EventUpdateManyMutationInput,
      EventUncheckedUpdateManyWithoutClubInput
    >;
  };

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[];
    OR?: EventScalarWhereInput[];
    NOT?: EventScalarWhereInput | EventScalarWhereInput[];
    id?: StringFilter<'Event'> | string;
    title?: StringFilter<'Event'> | string;
    description?: StringFilter<'Event'> | string;
    startDate?: DateTimeFilter<'Event'> | Date | string;
    endDate?: DateTimeFilter<'Event'> | Date | string;
    location?: StringNullableFilter<'Event'> | string | null;
    clubId?: StringNullableFilter<'Event'> | string | null;
    createdAt?: DateTimeFilter<'Event'> | Date | string;
    updatedAt?: DateTimeFilter<'Event'> | Date | string;
  };

  export type UserCreateWithoutClubMembersInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutClubMembersInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutClubMembersInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutClubMembersInput,
      UserUncheckedCreateWithoutClubMembersInput
    >;
  };

  export type ClubCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: EventCreateNestedManyWithoutClubInput;
  };

  export type ClubUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: EventUncheckedCreateNestedManyWithoutClubInput;
  };

  export type ClubCreateOrConnectWithoutMembersInput = {
    where: ClubWhereUniqueInput;
    create: XOR<
      ClubCreateWithoutMembersInput,
      ClubUncheckedCreateWithoutMembersInput
    >;
  };

  export type UserUpsertWithoutClubMembersInput = {
    update: XOR<
      UserUpdateWithoutClubMembersInput,
      UserUncheckedUpdateWithoutClubMembersInput
    >;
    create: XOR<
      UserCreateWithoutClubMembersInput,
      UserUncheckedCreateWithoutClubMembersInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutClubMembersInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutClubMembersInput,
      UserUncheckedUpdateWithoutClubMembersInput
    >;
  };

  export type UserUpdateWithoutClubMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutClubMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type ClubUpsertWithoutMembersInput = {
    update: XOR<
      ClubUpdateWithoutMembersInput,
      ClubUncheckedUpdateWithoutMembersInput
    >;
    create: XOR<
      ClubCreateWithoutMembersInput,
      ClubUncheckedCreateWithoutMembersInput
    >;
    where?: ClubWhereInput;
  };

  export type ClubUpdateToOneWithWhereWithoutMembersInput = {
    where?: ClubWhereInput;
    data: XOR<
      ClubUpdateWithoutMembersInput,
      ClubUncheckedUpdateWithoutMembersInput
    >;
  };

  export type ClubUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    events?: EventUpdateManyWithoutClubNestedInput;
  };

  export type ClubUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    events?: EventUncheckedUpdateManyWithoutClubNestedInput;
  };

  export type ClubCreateWithoutEventsInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: ClubMemberCreateNestedManyWithoutClubInput;
  };

  export type ClubUncheckedCreateWithoutEventsInput = {
    id?: string;
    name: string;
    description: string;
    cover?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: ClubMemberUncheckedCreateNestedManyWithoutClubInput;
  };

  export type ClubCreateOrConnectWithoutEventsInput = {
    where: ClubWhereUniqueInput;
    create: XOR<
      ClubCreateWithoutEventsInput,
      ClubUncheckedCreateWithoutEventsInput
    >;
  };

  export type EventAttendeeCreateWithoutEventInput = {
    id?: string;
    status: $Enums.RSVPStatus;
    user: UserCreateNestedOneWithoutEventAttendeesInput;
  };

  export type EventAttendeeUncheckedCreateWithoutEventInput = {
    id?: string;
    userId: string;
    status: $Enums.RSVPStatus;
  };

  export type EventAttendeeCreateOrConnectWithoutEventInput = {
    where: EventAttendeeWhereUniqueInput;
    create: XOR<
      EventAttendeeCreateWithoutEventInput,
      EventAttendeeUncheckedCreateWithoutEventInput
    >;
  };

  export type EventAttendeeCreateManyEventInputEnvelope = {
    data:
      | EventAttendeeCreateManyEventInput
      | EventAttendeeCreateManyEventInput[];
    skipDuplicates?: boolean;
  };

  export type ClubUpsertWithoutEventsInput = {
    update: XOR<
      ClubUpdateWithoutEventsInput,
      ClubUncheckedUpdateWithoutEventsInput
    >;
    create: XOR<
      ClubCreateWithoutEventsInput,
      ClubUncheckedCreateWithoutEventsInput
    >;
    where?: ClubWhereInput;
  };

  export type ClubUpdateToOneWithWhereWithoutEventsInput = {
    where?: ClubWhereInput;
    data: XOR<
      ClubUpdateWithoutEventsInput,
      ClubUncheckedUpdateWithoutEventsInput
    >;
  };

  export type ClubUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    members?: ClubMemberUpdateManyWithoutClubNestedInput;
  };

  export type ClubUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    cover?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    members?: ClubMemberUncheckedUpdateManyWithoutClubNestedInput;
  };

  export type EventAttendeeUpsertWithWhereUniqueWithoutEventInput = {
    where: EventAttendeeWhereUniqueInput;
    update: XOR<
      EventAttendeeUpdateWithoutEventInput,
      EventAttendeeUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      EventAttendeeCreateWithoutEventInput,
      EventAttendeeUncheckedCreateWithoutEventInput
    >;
  };

  export type EventAttendeeUpdateWithWhereUniqueWithoutEventInput = {
    where: EventAttendeeWhereUniqueInput;
    data: XOR<
      EventAttendeeUpdateWithoutEventInput,
      EventAttendeeUncheckedUpdateWithoutEventInput
    >;
  };

  export type EventAttendeeUpdateManyWithWhereWithoutEventInput = {
    where: EventAttendeeScalarWhereInput;
    data: XOR<
      EventAttendeeUpdateManyMutationInput,
      EventAttendeeUncheckedUpdateManyWithoutEventInput
    >;
  };

  export type UserCreateWithoutEventAttendeesInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutEventAttendeesInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutEventAttendeesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutEventAttendeesInput,
      UserUncheckedCreateWithoutEventAttendeesInput
    >;
  };

  export type EventCreateWithoutAttendeesInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club?: ClubCreateNestedOneWithoutEventsInput;
  };

  export type EventUncheckedCreateWithoutAttendeesInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    clubId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type EventCreateOrConnectWithoutAttendeesInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutAttendeesInput,
      EventUncheckedCreateWithoutAttendeesInput
    >;
  };

  export type UserUpsertWithoutEventAttendeesInput = {
    update: XOR<
      UserUpdateWithoutEventAttendeesInput,
      UserUncheckedUpdateWithoutEventAttendeesInput
    >;
    create: XOR<
      UserCreateWithoutEventAttendeesInput,
      UserUncheckedCreateWithoutEventAttendeesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutEventAttendeesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutEventAttendeesInput,
      UserUncheckedUpdateWithoutEventAttendeesInput
    >;
  };

  export type UserUpdateWithoutEventAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutEventAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type EventUpsertWithoutAttendeesInput = {
    update: XOR<
      EventUpdateWithoutAttendeesInput,
      EventUncheckedUpdateWithoutAttendeesInput
    >;
    create: XOR<
      EventCreateWithoutAttendeesInput,
      EventUncheckedCreateWithoutAttendeesInput
    >;
    where?: EventWhereInput;
  };

  export type EventUpdateToOneWithWhereWithoutAttendeesInput = {
    where?: EventWhereInput;
    data: XOR<
      EventUpdateWithoutAttendeesInput,
      EventUncheckedUpdateWithoutAttendeesInput
    >;
  };

  export type EventUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    club?: ClubUpdateOneWithoutEventsNestedInput;
  };

  export type EventUncheckedUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    clubId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserCreateWithoutListingsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutListingsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutListingsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutListingsInput,
      UserUncheckedCreateWithoutListingsInput
    >;
  };

  export type MessageCreateWithoutListingInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    sender: UserCreateNestedOneWithoutMessagesInput;
  };

  export type MessageUncheckedCreateWithoutListingInput = {
    id?: string;
    content: string;
    senderId: string;
    createdAt?: Date | string;
  };

  export type MessageCreateOrConnectWithoutListingInput = {
    where: MessageWhereUniqueInput;
    create: XOR<
      MessageCreateWithoutListingInput,
      MessageUncheckedCreateWithoutListingInput
    >;
  };

  export type MessageCreateManyListingInputEnvelope = {
    data: MessageCreateManyListingInput | MessageCreateManyListingInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutListingsInput = {
    update: XOR<
      UserUpdateWithoutListingsInput,
      UserUncheckedUpdateWithoutListingsInput
    >;
    create: XOR<
      UserCreateWithoutListingsInput,
      UserUncheckedCreateWithoutListingsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutListingsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutListingsInput,
      UserUncheckedUpdateWithoutListingsInput
    >;
  };

  export type UserUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type MessageUpsertWithWhereUniqueWithoutListingInput = {
    where: MessageWhereUniqueInput;
    update: XOR<
      MessageUpdateWithoutListingInput,
      MessageUncheckedUpdateWithoutListingInput
    >;
    create: XOR<
      MessageCreateWithoutListingInput,
      MessageUncheckedCreateWithoutListingInput
    >;
  };

  export type MessageUpdateWithWhereUniqueWithoutListingInput = {
    where: MessageWhereUniqueInput;
    data: XOR<
      MessageUpdateWithoutListingInput,
      MessageUncheckedUpdateWithoutListingInput
    >;
  };

  export type MessageUpdateManyWithWhereWithoutListingInput = {
    where: MessageScalarWhereInput;
    data: XOR<
      MessageUpdateManyMutationInput,
      MessageUncheckedUpdateManyWithoutListingInput
    >;
  };

  export type UserCreateWithoutMessagesInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutMessagesInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutMessagesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutMessagesInput,
      UserUncheckedCreateWithoutMessagesInput
    >;
  };

  export type ListingCreateWithoutMessagesInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    seller: UserCreateNestedOneWithoutListingsInput;
  };

  export type ListingUncheckedCreateWithoutMessagesInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    sellerId: string;
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ListingCreateOrConnectWithoutMessagesInput = {
    where: ListingWhereUniqueInput;
    create: XOR<
      ListingCreateWithoutMessagesInput,
      ListingUncheckedCreateWithoutMessagesInput
    >;
  };

  export type UserUpsertWithoutMessagesInput = {
    update: XOR<
      UserUpdateWithoutMessagesInput,
      UserUncheckedUpdateWithoutMessagesInput
    >;
    create: XOR<
      UserCreateWithoutMessagesInput,
      UserUncheckedCreateWithoutMessagesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutMessagesInput,
      UserUncheckedUpdateWithoutMessagesInput
    >;
  };

  export type UserUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type ListingUpsertWithoutMessagesInput = {
    update: XOR<
      ListingUpdateWithoutMessagesInput,
      ListingUncheckedUpdateWithoutMessagesInput
    >;
    create: XOR<
      ListingCreateWithoutMessagesInput,
      ListingUncheckedCreateWithoutMessagesInput
    >;
    where?: ListingWhereInput;
  };

  export type ListingUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ListingWhereInput;
    data: XOR<
      ListingUpdateWithoutMessagesInput,
      ListingUncheckedUpdateWithoutMessagesInput
    >;
  };

  export type ListingUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput;
  };

  export type ListingUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    sellerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionCreateWithoutMaterialInput = {
    id?: string;
    version: number;
    file: string;
    createdAt?: Date | string;
    uploader: UserCreateNestedOneWithoutMaterialVersionsInput;
  };

  export type MaterialVersionUncheckedCreateWithoutMaterialInput = {
    id?: string;
    version: number;
    file: string;
    uploaderId: string;
    createdAt?: Date | string;
  };

  export type MaterialVersionCreateOrConnectWithoutMaterialInput = {
    where: MaterialVersionWhereUniqueInput;
    create: XOR<
      MaterialVersionCreateWithoutMaterialInput,
      MaterialVersionUncheckedCreateWithoutMaterialInput
    >;
  };

  export type MaterialVersionCreateManyMaterialInputEnvelope = {
    data:
      | MaterialVersionCreateManyMaterialInput
      | MaterialVersionCreateManyMaterialInput[];
    skipDuplicates?: boolean;
  };

  export type UserCreateWithoutMaterialsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materialVersions?: MaterialVersionCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutMaterialsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materialVersions?: MaterialVersionUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutMaterialsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutMaterialsInput,
      UserUncheckedCreateWithoutMaterialsInput
    >;
  };

  export type MaterialVersionUpsertWithWhereUniqueWithoutMaterialInput = {
    where: MaterialVersionWhereUniqueInput;
    update: XOR<
      MaterialVersionUpdateWithoutMaterialInput,
      MaterialVersionUncheckedUpdateWithoutMaterialInput
    >;
    create: XOR<
      MaterialVersionCreateWithoutMaterialInput,
      MaterialVersionUncheckedCreateWithoutMaterialInput
    >;
  };

  export type MaterialVersionUpdateWithWhereUniqueWithoutMaterialInput = {
    where: MaterialVersionWhereUniqueInput;
    data: XOR<
      MaterialVersionUpdateWithoutMaterialInput,
      MaterialVersionUncheckedUpdateWithoutMaterialInput
    >;
  };

  export type MaterialVersionUpdateManyWithWhereWithoutMaterialInput = {
    where: MaterialVersionScalarWhereInput;
    data: XOR<
      MaterialVersionUpdateManyMutationInput,
      MaterialVersionUncheckedUpdateManyWithoutMaterialInput
    >;
  };

  export type UserUpsertWithoutMaterialsInput = {
    update: XOR<
      UserUpdateWithoutMaterialsInput,
      UserUncheckedUpdateWithoutMaterialsInput
    >;
    create: XOR<
      UserCreateWithoutMaterialsInput,
      UserUncheckedCreateWithoutMaterialsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutMaterialsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutMaterialsInput,
      UserUncheckedUpdateWithoutMaterialsInput
    >;
  };

  export type UserUpdateWithoutMaterialsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materialVersions?: MaterialVersionUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutMaterialsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materialVersions?: MaterialVersionUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type StudyMaterialCreateWithoutVersionsInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    uploader: UserCreateNestedOneWithoutMaterialsInput;
  };

  export type StudyMaterialUncheckedCreateWithoutVersionsInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    uploaderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type StudyMaterialCreateOrConnectWithoutVersionsInput = {
    where: StudyMaterialWhereUniqueInput;
    create: XOR<
      StudyMaterialCreateWithoutVersionsInput,
      StudyMaterialUncheckedCreateWithoutVersionsInput
    >;
  };

  export type UserCreateWithoutMaterialVersionsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeCreateNestedManyWithoutUserInput;
    listings?: ListingCreateNestedManyWithoutSellerInput;
    messages?: MessageCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialCreateNestedManyWithoutUploaderInput;
  };

  export type UserUncheckedCreateWithoutMaterialVersionsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    role?: $Enums.UserRole;
    verified?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    clubMembers?: ClubMemberUncheckedCreateNestedManyWithoutUserInput;
    eventAttendees?: EventAttendeeUncheckedCreateNestedManyWithoutUserInput;
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput;
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    materials?: StudyMaterialUncheckedCreateNestedManyWithoutUploaderInput;
  };

  export type UserCreateOrConnectWithoutMaterialVersionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutMaterialVersionsInput,
      UserUncheckedCreateWithoutMaterialVersionsInput
    >;
  };

  export type StudyMaterialUpsertWithoutVersionsInput = {
    update: XOR<
      StudyMaterialUpdateWithoutVersionsInput,
      StudyMaterialUncheckedUpdateWithoutVersionsInput
    >;
    create: XOR<
      StudyMaterialCreateWithoutVersionsInput,
      StudyMaterialUncheckedCreateWithoutVersionsInput
    >;
    where?: StudyMaterialWhereInput;
  };

  export type StudyMaterialUpdateToOneWithWhereWithoutVersionsInput = {
    where?: StudyMaterialWhereInput;
    data: XOR<
      StudyMaterialUpdateWithoutVersionsInput,
      StudyMaterialUncheckedUpdateWithoutVersionsInput
    >;
  };

  export type StudyMaterialUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    uploader?: UserUpdateOneRequiredWithoutMaterialsNestedInput;
  };

  export type StudyMaterialUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUpsertWithoutMaterialVersionsInput = {
    update: XOR<
      UserUpdateWithoutMaterialVersionsInput,
      UserUncheckedUpdateWithoutMaterialVersionsInput
    >;
    create: XOR<
      UserCreateWithoutMaterialVersionsInput,
      UserUncheckedCreateWithoutMaterialVersionsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutMaterialVersionsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutMaterialVersionsInput,
      UserUncheckedUpdateWithoutMaterialVersionsInput
    >;
  };

  export type UserUpdateWithoutMaterialVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUpdateManyWithoutUserNestedInput;
    listings?: ListingUpdateManyWithoutSellerNestedInput;
    messages?: MessageUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUpdateManyWithoutUploaderNestedInput;
  };

  export type UserUncheckedUpdateWithoutMaterialVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    verified?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    clubMembers?: ClubMemberUncheckedUpdateManyWithoutUserNestedInput;
    eventAttendees?: EventAttendeeUncheckedUpdateManyWithoutUserNestedInput;
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    materials?: StudyMaterialUncheckedUpdateManyWithoutUploaderNestedInput;
  };

  export type ClubMemberCreateManyUserInput = {
    id?: string;
    clubId: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
  };

  export type EventAttendeeCreateManyUserInput = {
    id?: string;
    eventId: string;
    status: $Enums.RSVPStatus;
  };

  export type ListingCreateManySellerInput = {
    id?: string;
    title: string;
    description: string;
    price: number;
    condition: $Enums.Condition;
    category: $Enums.Category;
    images?: ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MessageCreateManySenderInput = {
    id?: string;
    content: string;
    listingId: string;
    createdAt?: Date | string;
  };

  export type StudyMaterialCreateManyUploaderInput = {
    id?: string;
    title: string;
    description: string;
    subject: string;
    type: $Enums.MaterialType;
    file: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MaterialVersionCreateManyUploaderInput = {
    id?: string;
    version: number;
    file: string;
    materialId: string;
    createdAt?: Date | string;
  };

  export type ClubMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    club?: ClubUpdateOneRequiredWithoutMembersNestedInput;
  };

  export type ClubMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    clubId?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    clubId?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventAttendeeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
    event?: EventUpdateOneRequiredWithoutAttendeesNestedInput;
  };

  export type EventAttendeeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type EventAttendeeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type ListingUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: MessageUpdateManyWithoutListingNestedInput;
  };

  export type ListingUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: MessageUncheckedUpdateManyWithoutListingNestedInput;
  };

  export type ListingUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    condition?: EnumConditionFieldUpdateOperationsInput | $Enums.Condition;
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category;
    images?: ListingUpdateimagesInput | string[];
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    listing?: ListingUpdateOneRequiredWithoutMessagesNestedInput;
  };

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    listingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    listingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StudyMaterialUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    versions?: MaterialVersionUpdateManyWithoutMaterialNestedInput;
  };

  export type StudyMaterialUncheckedUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    versions?: MaterialVersionUncheckedUpdateManyWithoutMaterialNestedInput;
  };

  export type StudyMaterialUncheckedUpdateManyWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    subject?: StringFieldUpdateOperationsInput | string;
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    material?: StudyMaterialUpdateOneRequiredWithoutVersionsNestedInput;
  };

  export type MaterialVersionUncheckedUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    materialId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionUncheckedUpdateManyWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    materialId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberCreateManyClubInput = {
    id?: string;
    userId: string;
    role?: $Enums.ClubRole;
    joinedAt?: Date | string;
  };

  export type EventCreateManyClubInput = {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ClubMemberUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutClubMembersNestedInput;
  };

  export type ClubMemberUncheckedUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ClubMemberUncheckedUpdateManyWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    role?: EnumClubRoleFieldUpdateOperationsInput | $Enums.ClubRole;
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendees?: EventAttendeeUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendees?: EventAttendeeUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateManyWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    location?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventAttendeeCreateManyEventInput = {
    id?: string;
    userId: string;
    status: $Enums.RSVPStatus;
  };

  export type EventAttendeeUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
    user?: UserUpdateOneRequiredWithoutEventAttendeesNestedInput;
  };

  export type EventAttendeeUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type EventAttendeeUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    status?: EnumRSVPStatusFieldUpdateOperationsInput | $Enums.RSVPStatus;
  };

  export type MessageCreateManyListingInput = {
    id?: string;
    content: string;
    senderId: string;
    createdAt?: Date | string;
  };

  export type MessageUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput;
  };

  export type MessageUncheckedUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageUncheckedUpdateManyWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionCreateManyMaterialInput = {
    id?: string;
    version: number;
    file: string;
    uploaderId: string;
    createdAt?: Date | string;
  };

  export type MaterialVersionUpdateWithoutMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    uploader?: UserUpdateOneRequiredWithoutMaterialVersionsNestedInput;
  };

  export type MaterialVersionUncheckedUpdateWithoutMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaterialVersionUncheckedUpdateManyWithoutMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string;
    version?: IntFieldUpdateOperationsInput | number;
    file?: StringFieldUpdateOperationsInput | string;
    uploaderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
