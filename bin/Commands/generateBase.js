
module.exports = `  type Operators = '>'|'<>'|'<'|'='|'>='|'<=';
  type OrderByDirection = 'DESC' | 'ASC';
  interface QueryCallback<TSrc, TColumn extends string, TReferences, TModel> {
    (callback: (this: TableBuilder<TSrc, TColumn, TReferences, TModel>, builder: TableBuilder<TSrc, TColumn, TReferences, TModel>) => void);
    (callback: (this: TableBuilder<TSrc, TColumn, TReferences, TModel>, builder: TableBuilder<TSrc, TColumn, TReferences, TModel>, ...args: any[]) => void);
  }
  interface RawQueryBuilderk<TSrc, TColumn extends string, TReferences, TModel> {
    (sql: string, ...bindings: Array<any>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (sql: string, bindings: Array<any>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface ColumnNameQueryBuilder<TSrc, TColumn extends string, TReferences, TModel> {
      (columnName: TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
      (columnName: keyof TModel): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface WhereNull<TSrc, TColumn extends string, TReferences, TModel> extends ColumnNameQueryBuilder<TSrc, TColumn, TReferences, TModel> { 
  }
  interface GroupBy<TSrc, TColumn extends string, TReferences, TModel> extends ColumnNameQueryBuilder<TSrc, TColumn, TReferences, TModel> { 
  }
  interface OrderBy<TSrc, TColumn extends string, TReferences, TModel> extends ColumnNameQueryBuilder<TSrc, TColumn, TReferences, TModel> { 
    (columnName: TColumn | keyof TModel, direction?: OrderByDirection): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface Where<TSrc, TColumn extends string, TReferences, TModel> {
    (columnName: TColumn | keyof TModel, value: any): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (columnName: TColumn | keyof TModel, operator: Operators, value: any): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (object: { [x in (keyof TModel)]: TModel[x] }): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (whereObj: { [x in TColumn]: any }): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface WhereIn<TSrc, TColumn extends string, TReferences, TModel> {
    (columnName: TColumn | keyof TModel, values: knex.QueryBuilder | any[]): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (columnNames: TColumn[] | (keyof TModel)[], values: any[][] | knex.QueryBuilder | QueryCallback<TSrc, TColumn, TReferences, TModel>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface Select<TSrc, TColumn extends string, TReferences, TModel> {
    (...columns: (TColumn|'*')[]): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface JoinCallback<TSrc, TColumn extends string, TReferences, TModel> {
      (this: JoinClause<TSrc, TColumn, TReferences, TModel>, join: JoinClause<TSrc, TColumn, TReferences, TModel>): void;
  }
  interface JoinClause<TSrc, TColumn extends string, TReferences, TModel> {
    on(raw: knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    on(callback: JoinCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    on(columns: { [key: string]: TColumn | string | knex.Raw }): JoinClause<TSrc, TColumn, TReferences, TModel>;
    on(column1: string, column2: TColumn): JoinClause<TSrc, TColumn, TReferences, TModel>;
    on(column1: string, raw: knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    on(column1: string, operator: Operators, column2: TColumn | knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOn(raw: knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOn(callback: JoinCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOn(columns: { [key: string]: string | TColumn | knex.Raw }): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOn(column1: string, column2: TColumn): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOn(column1: string, raw: knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOn(column1: string, operator: Operators, column2: TColumn| string | knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOn(raw: knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOn(callback: JoinCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOn(columns: { [key: string]: TColumn | knex.Raw }): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOn(column1: string, column2: TColumn): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOn(column1: string, raw: knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOn(column1: string, operator: Operators, column2: TColumn | string | knex.Raw): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onIn(column1: string, values: any[]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnIn(column1: string, values: any[]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnIn(column1: string, values: any[]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onNotIn(column1: string, values: any[]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnNotIn(column1: string, values: any[]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnNotIn(column1: string, values: any[]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onNull(column1: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnNull(column1: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnNull(column1: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onNotNull(column1: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnNotNull(column1: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnNotNull(column1: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onNotExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnNotExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnNotExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onBetween(column1: string, range: [any, any]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnBetween(column1: string, range: [any, any]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnBetween(column1: string, range: [any, any]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    onNotBetween(column1: string, range: [any, any]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    andOnNotBetween(column1: string, range: [any, any]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    orOnNotBetween(column1: string, range: [any, any]): JoinClause<TSrc, TColumn, TReferences, TModel>;
    using(column: string | string[] | knex.Raw | { [key: string]: string | knex.Raw }): JoinClause<TSrc, TColumn, TReferences, TModel>;
    type(type: string): JoinClause<TSrc, TColumn, TReferences, TModel>;
  }
  interface JoinCallbackExtra<TSrc, TColumn extends string, TReferences, TModel, TJoinColumn extends string, TJoinModel> {
      (this: JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>, join: JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>): void;
  }
  interface JoinClauseExtra<TSrc, TColumn extends string, TReferences, TModel, TJoinColumn extends string, TJoinModel> {
    on(raw: knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    on(callback: JoinCallbackExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    on(columns: { [key in TJoinColumn]: TColumn | string | knex.Raw }): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    on(column1: TJoinColumn, column2: TColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    on(column1: TJoinColumn, raw: knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    on(column1: TJoinColumn, operator: Operators, column2: TColumn | knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOn(raw: knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOn(callback: JoinCallbackExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOn(columns: { [key in TJoinColumn]: string | TColumn | knex.Raw }): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOn(column1: TJoinColumn, column2: TColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOn(column1: TJoinColumn, raw: knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOn(column1: TJoinColumn, operator: Operators, column2: TColumn| string | knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOn(raw: knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOn(callback: JoinCallbackExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOn(columns: { [key in TJoinColumn]: TColumn | knex.Raw }): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOn(column1: TJoinColumn, column2: TColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOn(column1: TJoinColumn, raw: knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOn(column1: TJoinColumn, operator: Operators, column2: TColumn | string | knex.Raw): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onIn(column1: TJoinColumn, values: any[]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnIn(column1: TJoinColumn, values: any[]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnIn(column1: TJoinColumn, values: any[]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onNotIn(column1: TJoinColumn, values: any[]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnNotIn(column1: TJoinColumn, values: any[]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnNotIn(column1: TJoinColumn, values: any[]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onNull(column1: TJoinColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnNull(column1: TJoinColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnNull(column1: TJoinColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onNotNull(column1: TJoinColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnNotNull(column1: TJoinColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnNotNull(column1: TJoinColumn): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onNotExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnNotExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnNotExists(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onBetween(column1: TJoinColumn, range: [any, any]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnBetween(column1: TJoinColumn, range: [any, any]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnBetween(column1: TJoinColumn, range: [any, any]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    onNotBetween(column1: TJoinColumn, range: [any, any]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    andOnNotBetween(column1: TJoinColumn, range: [any, any]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    orOnNotBetween(column1: TJoinColumn, range: [any, any]): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    using(column: string | string[] | knex.Raw | { [key: string]: string | knex.Raw }): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
    type(type: string): JoinClauseExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>;
  }
  interface JoinEssential<TSrc, TColumn extends string, TReferences, TModel> {
    (raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, clause: JoinCallback<TSrc, TColumn, TReferences, TModel>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, columns: { [key in string]: TColumn | string | number | knex.Raw }): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, column1: string, column2: TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, column1: string, raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, column1: string, operator: Operators, column2: TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface JoinExtra<TSrc, TColumn extends string, TReferences, TModel, TJoinColumn extends string, TJoinModel> {
    (raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, clause: JoinCallbackExtra<TSrc, TColumn, TReferences, TModel, TJoinColumn, TJoinModel>): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, columns: { [key in TJoinColumn]: TColumn | string | number | knex.Raw }): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, column1: TJoinColumn, column2: TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, column1: TJoinColumn, raw: knex.Raw): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    (tableName: TReferences | QueryCallback<TSrc, TColumn, TReferences, TModel>, column1: TJoinColumn, operator: Operators, column2: TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
  }
  interface TableBuilder<TSrc, TColumn extends string, TReferences, TModel> extends knex.QueryBuilder {
    select: Select<TSrc, TColumn, TReferences, TModel>;
    columns: Select<TSrc, TColumn, TReferences, TModel>;
    column: Select<TSrc, TColumn, TReferences, TModel>;
    where: Where<TSrc, TColumn, TReferences, TModel>;
    andWhere: Where<TSrc, TColumn, TReferences, TModel>;
    orWhere: Where<TSrc, TColumn, TReferences, TModel>;
    whereNot: Where<TSrc, TColumn, TReferences, TModel>;
    andWhereNot: Where<TSrc, TColumn, TReferences, TModel>;
    orWhereNot: Where<TSrc, TColumn, TReferences, TModel>;
    whereIn: WhereIn<TSrc, TColumn, TReferences, TModel>;
    orWhereIn: WhereIn<TSrc, TColumn, TReferences, TModel>;
    whereNotIn: WhereIn<TSrc, TColumn, TReferences, TModel>;
    orWhereNotIn: WhereIn<TSrc, TColumn, TReferences, TModel>;
    whereNull: WhereNull<TSrc, TColumn, TReferences, TModel>;
    orWhereNull: WhereNull<TSrc, TColumn, TReferences, TModel>;
    whereNotNull: WhereNull<TSrc, TColumn, TReferences, TModel>;
    orWhereNotNull: WhereNull<TSrc, TColumn, TReferences, TModel>;
    groupBy: GroupBy<TSrc, TColumn, TReferences, TModel>;
    groupByRaw: RawQueryBuilderk<TSrc, TColumn, TReferences, TModel>;
    orderBy: OrderBy<TSrc, TColumn, TReferences, TModel>;
    orderByRaw: RawQueryBuilderk<TSrc, TColumn, TReferences, TModel>;
    offset(offset: number): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    limit(limit: number): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    
    join: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    joinRaw(tableName: TReferences, binding?: any): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    innerJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    leftJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    leftOuterJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    rightJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    rightOuterJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    outerJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    fullOuterJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;
    crossJoin: JoinEssential<TSrc, TColumn, TReferences, TModel>;

    count(...columnNames: TColumn[] | (keyof TModel)[]): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    count(columnName: TColumn | keyof TModel): TableBuilder<TSrc, TColumn, TReferences, TModel>;

    increment(columnName: TColumn | keyof TModel, amount?: number): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    decrement(columnName: TColumn | keyof TModel, amount?: number): TableBuilder<TSrc, TColumn, TReferences, TModel>;

    insert(data: TModel[], returning?: (keyof TModel)[] | keyof TModel): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    insert(data: TModel[], returning?: TColumn[] | TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    returning(column: (keyof TModel)[] | keyof TModel): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    returning(column: TColumn[] | TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    modify(callback: QueryCallback<TSrc, TColumn, TReferences, TModel>, ...args: any[]): TableBuilder<TSrc, TColumn, TReferences, TModel>;

    update(data: TModel, returning?: (keyof TModel)[] | keyof TModel | TColumn[] | TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    update(columnName: TColumn | keyof TModel, value: any, returning?: (keyof TModel)[] | keyof TModel | TColumn[] | TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    
    del(returning?: (keyof TModel)[] | keyof TModel | TColumn[] | TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    delete(returning?: (keyof TModel)[] | keyof TModel | TColumn[] | TColumn): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    
    org(orgId: string): TableBuilder<TSrc, TColumn, TReferences, TModel>;
    noOrg(): TableBuilder<TSrc, TColumn, TReferences, TModel>;

    then<T>(onFulfill?: (rows: TModel[]) => Bluebird<T>, onReject?: (err: Error) => Bluebird<T>): Bluebird<T>;
  }`;