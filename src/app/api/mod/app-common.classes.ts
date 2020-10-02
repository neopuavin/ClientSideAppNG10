import {
  IFromClauseLink,
  SQLJoinChars,
  RequestParams,
} from './app-params.model';

export interface IDataColumn {
  // [tableAlias.]<fieldName>[@<fieldAlias>]
  // [aggregateFuction]([tableAlias.]<fieldName>)[@<fieldAlias>]
  fieldName?: string;
  fieldAlias?: string;
  fieldKey?: string;
  tableAlias?: string;
  caption?: string;
  aggregateFuction?: string;
  forLookup?: boolean;
  value?: any;

  // when supplied, inline lookup will be generated. Object of key-value pairs
  // which will be used to search for display text of data field.
  // {key1:displayValue1,...,key#:displayValue#}
  // In the return object, this will be set as one of the elements in
  // the inline lokkup object
  // returnObject.lookups.FIELD_NAME_DISPLAY_FIELD.key#

  displayField?: string;
  visible?: boolean;
  isKey?: boolean;

  requiredFields?: Array<string>;
}

export interface IProcessRequestData {
  data: Array<Array<any>>;
  lookups: Array<any>;
}

export interface IFieldExpression {
  fieldParam?: IFieldDefParam;
  operator?: string;
  logicalOr?: boolean;
  logicalAnd?: boolean;
  logicalNot?: boolean;
  groupStart?: boolean;
  logicalOrGroupStart?: boolean;
  logicalAndGroupStart?: boolean;
  groupEnd?: boolean;
  logicalOrGroupEnd?: boolean;
  logicalAndGroupEnd?: boolean;
  value?: any;
  value1?: any;
  value2?: any;
  values?: Array<any>;
  parent?: IFieldExpression;
  children?: Array<IFieldExpression>;
}
export interface IFieldDefParam {
  fieldName?: string;
  fieldAlias?: string;
  tableAlias?: string;
  aggregateFunction?: string;
  displayField?: string;
  sortDescending?: boolean;
}

export interface ISnapshot {
  name: string;
  table: any;
  rows: Array<any>;
}

export interface ILookupItem {
  key: number;
  text?: string;
  code?: string;
  group?: number;
  back?: string;
  fore?: string;
}

export interface IUserInfo {
  key: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  rights: any;
}

export class DataColumn {
  constructor(args: IDataColumn) {
    this.fieldName = args.fieldName;
    this.fieldKey = args.fieldKey;
    this.caption = args.caption ? args.caption : '';
    this.fieldAlias = args.fieldAlias ? args.fieldAlias : '';
    this.tableAlias = args.tableAlias ? args.tableAlias : '';
    this.displayField = args.displayField ? args.displayField : '';
    this.aggregateFunction = args.aggregateFuction ? args.aggregateFuction : '';
    this.isKey = !args.isKey ? false : args.isKey;

    this.requiredFields = args.requiredFields;

    // override default visibility value only if args.visibility is defined
    if (args.visible != undefined) this.visible = args.visible;
  }

  public parentOption: DataOption = null;
  public fieldKey: string;
  public fieldName: string;
  public tableAlias: string;
  public fieldAlias: string;
  public displayField: string;
  public aggregateFunction: string;
  public caption: string;
  public isKey: boolean;
  public visible: boolean = true;

  public allowFilter: boolean;
  public sortAsc: boolean;
  public sortDesc: boolean;
  public filters: Array<any>;
  public requiredFields: Array<string>;
}

export class DataOption {
  constructor(public columns?: Array<DataColumn>, args?: {}) {
    if (args != undefined) {
      // set other properties
    }
  }

  public pageNumber: number = 1;
  public pageSize: number = 1000;
  public totalPages: number = -1;
  public totalRecords: number = -1;

  public fields: Array<DataColumn> = [];
  public debugString: Array<string> = [];
  public code: string = '';
  public fromLinks: Array<IFromClauseLink> = [];

  private _snapshots: Array<ISnapshot> = [];
  public Snapshot(name: string) {
    return this._snapshots.find((s) => s.name == name);
  }
  public RequestSnapshot(name: string, table: any) {
    if (!table || !name) return;
  }

  private OPEN_PAREN = '(';
  private CLOSE_PAREN = '(';
  private AND_OPERATOR = '^';
  private OR_OPERATOR = '|';

  public AddField(fieldName: string): DataOption {
    this.AddFieldWithOptions({ fieldName: fieldName });
    return this;
  }

  public AddFieldWithOptions(args: IDataColumn): DataOption {
    // find existing column where field definition properties will be set on
    // same as in the processed field object

    if (this.columns) {
      const col = this.columns.find((c) => c.fieldName == args.fieldName);
      // cascade field definition properties to column properties
      if (col) col.displayField = args.displayField;
    }

    // if field already exist, double call to field definition and therefore
    // no further action is necessary. This is just for backward compatibility
    // when field definition is not yet part of the column definition!
    // WARNING: activating this line may cause inline lookup to fail!
    if (!args.forLookup)
      if (this.fields.find((f) => f.fieldName == args.fieldName)) return this;

    const fld = new DataColumn(args);
    fld.parentOption = this;
    this.fields.push(fld);
    return this;
  }

  private encodeFromLink(
    link: IFromClauseLink,
    defJoin?: SQLJoinChars
  ): string {
    // returns formatted join statement
    if (!defJoin) defJoin = SQLJoinChars.LEFT_JOIN_SYMBOL;

    /*
    return string format: <joinType><linkTableCode>[@<tableAlias>],<localField>[,<foreignField>]
      joinType - innerJoin(-) or leftJoin(`)
      linkTableCode - code associated with the table being linked to the parent table
      tableAlias - optional string parameter which will serve as the link table identity. this is
        commonly supplied when a table code is being used multiple times in  the SQL statement
        to ensure uniqueness of linked table identity
      localField - is the fieldname found in the parent table where the linked table is going to be
        linked to.
      foreignField - optional string field parameter found in the linked table where the parent table
        will set relation to. If this parameter is supplied, the defined key field of the linked
        table will be used.
    */
    return (
      (link.join ? link.join : defJoin) +
      link.code +
      (link.alias ? '@' + link.alias : '') +
      ',' +
      link.localField +
      (link.foreignField ? ',' + link.foreignField : '')
    );
  }

  public GetRequestParams(
    pageSize?: number,
    pageNumber?: number
  ): RequestParams {
    let ret: RequestParams = new RequestParams();
    ret.code = this.fromClauseCode;
    ret.filter = this.whereClause;
    ret.sortFields = this.orderByClause;
    return ret;
  }

  public GetFieldExpression(
    fieldParam: IFieldDefParam,
    noFieldAlias?: boolean
  ): string {
    if (!noFieldAlias) noFieldAlias = false;
    const fldExpr =
      (fieldParam.tableAlias ? fieldParam.tableAlias + '.' : '') +
      fieldParam.fieldName;
    let fldAlias: string =
      (fieldParam.fieldAlias || fieldParam.displayField) && !noFieldAlias
        ? '@' +
          fieldParam.fieldAlias +
          (fieldParam.displayField ? '^' + fieldParam.displayField : '')
        : '';
    const aggExpr = fieldParam.aggregateFunction;
    if (aggExpr) {
      // aggregate function specified
      if (!fldAlias) fldAlias = `@${aggExpr}_of_${fieldParam.fieldName}`;
      return `${aggExpr}(${fldExpr})${fldAlias}`;
    } else {
      return fldExpr + fldAlias;
    }
  }

  public get fromClauseCode(): string {
    if (!this.code) return ''; // if main table code is  not supplied
    let ret: string =
      this.code +
      (this.fromLinks.length ? SQLJoinChars.TABLE_CODE_SEPARATOR : '');
    this.fromLinks.forEach((L) => {
      //this.debugString.push(L.code + (L.alias ? '@' + L.alias :''));
      ret += this.encodeFromLink(L);
      if (L.leftJoin) ret += this.encodeFromLink(L.leftJoin);
      ret += ';';
    });
    return ret;
  }

  private _SelectStack: Array<any> = [];
  public Select(fields?: any): DataOption {
    if (fields) {
    }
    return this;
  }

  private _BaseFilterOn: boolean = true;
  public get BaseFilterOff(): DataOption {
    this._BaseFilterOn = false;
    return this;
  }

  public get BaseFilterOn(): DataOption {
    this._BaseFilterOn = true;
    return this;
  }

  private _SubFilterOn: boolean = true;
  public get SubFilterOff(): DataOption {
    this._SubFilterOn = false;
    return this;
  }

  public get SubFilterOn(): DataOption {
    this._SubFilterOn = true;
    return this;
  }

  private BaseWhereMode: boolean = false;
  private _BaseWhereTree: Array<IFieldExpression> = [];
  public get BaseWhereTree(): Array<IFieldExpression> {
    return this._BaseWhereTree;
  }

  private _WhereTree: Array<IFieldExpression> = [];
  public get WhereTree(): Array<IFieldExpression> {
    return this._WhereTree;
  }

  private _WhereStack: Array<IFieldExpression> = [];
  public get WhereStack(): Array<IFieldExpression> {
    return this._WhereStack;
  }
  private _WhereStackPersistent: Array<IFieldExpression> = [];
  public get WhereStackPersistent(): Array<IFieldExpression> {
    return this._WhereStackPersistent;
  }

  private GetLogicalOperator(
    currExpr: string,
    currExprObj: IFieldExpression
  ): string {
    if (currExpr.length == 0) return '';
    if (
      currExpr.endsWith('(') ||
      currExpr.endsWith('|') ||
      currExpr.endsWith('^')
    )
      return '';
    let optr: string = '';
    if (currExprObj.parent) {
      if (currExprObj.parent.logicalAndGroupStart) {
        optr = '^';
      } else if (currExprObj.parent.logicalOrGroupStart) {
        optr = '|';
      }
    } else {
      optr = '^';
    }
    return optr;
  }

  private GetValueString(expr: IFieldExpression): string {
    let ret: string = '';
    if (expr.value) {
      // single value
      if (typeof expr.value == 'string') {
        ret = `"${expr.value}"`;
      } else {
        ret = `${expr.value}`;
      }
    } else if (expr.values) {
      // array type
      const isString = typeof expr.values[0] == 'string';
      expr.values.forEach((v) => {
        ret += (ret.length ? ',' : '') + (isString ? `"${v}"` : `${v}`);
      });
    } else if (expr.value1) {
      // two values
      if (typeof expr.value == 'string') {
        ret = `"${expr.value1}"^"${expr.value2}"`;
      } else {
        ret = `${expr.value1}^${expr.value2}`;
      }
    } else {
    }

    return ret;
  }

  public get whereClause(): string {
    const baseExpr: string = this._BaseFilterOn
      ? this.whereClauseSub(this.BaseWhereTree)
      : '';
    const subExpr: string = this._SubFilterOn ? this.whereClauseSub() : '';

    return `${
      baseExpr.length ? `(${baseExpr})${subExpr.length ? '^' : ''}` : ''
    }${subExpr.length ? `(${subExpr})` : ''}`;
  }

  public get orderByClause(): string {
    let ret: string = '';

    this._orderByBase.forEach((o) => {
      ret += `${ret.length ? '`' : ''}${
        o.sortDescending ? '-' : ''
      }${this.GetFieldExpression(o, true)}`;
    });
    this._orderBy.forEach((o) => {
      ret += `${ret.length ? '`' : ''}${
        o.sortDescending ? '-' : ''
      }${this.GetFieldExpression(o, true)}`;
    });
    return ret;
  }

  private whereClauseSub(exprCollection?: Array<IFieldExpression>): string {
    //if (exprCollection == null) return 'NULL';
    if (!exprCollection) exprCollection = this.WhereTree;
    let ret: string = '';
    exprCollection.forEach((e) => {
      if (e.groupStart || e.logicalAndGroupStart || e.logicalOrGroupStart) {
        ret += '(' + this.whereClauseSub(e.children);
      } else if (e.groupEnd || e.logicalAndGroupEnd || e.logicalOrGroupEnd) {
        ret += ')';
      } else if (e.logicalAnd) {
        ret += '^';
      } else if (e.logicalOr) {
        ret += '|';
      } else if (e.fieldParam) {
        ret += `${this.GetLogicalOperator(ret, e)}{${this.GetFieldExpression(
          e.fieldParam
        )}${e.operator ? '|' + e.operator : ''}|${this.GetValueString(e)}}`;
      } else {
      }
    });
    //return JSON.stringify(this.WhereTree);
    return ret;
  }

  private _CurrParentExpr: IFieldExpression = null;
  private _CurrParentExprBase: IFieldExpression = null;

  private PushExpression(expr: IFieldExpression) {
    // positions filter expression to the correct place in the filter heirarchy

    let collection: Array<IFieldExpression>;
    const isBase = this.BaseWhereMode;

    // get collection object to add expression to
    if (isBase) {
      if (!this._CurrParentExprBase) collection = this._BaseWhereTree;
      else {
        if (!this._CurrParentExprBase.children)
          this._CurrParentExprBase.children = [];
        expr.parent = this._CurrParentExprBase;
        collection = this._CurrParentExprBase.children;
      }
    } else {
      if (!this._CurrParentExpr) collection = this._WhereTree;
      else {
        if (!this._CurrParentExpr.children) this._CurrParentExpr.children = [];
        expr.parent = this._CurrParentExpr;
        collection = this._CurrParentExpr.children;
      }
    }

    collection.push(expr);

    if (
      expr.groupStart ||
      expr.logicalAndGroupStart ||
      expr.logicalOrGroupStart
    ) {
      // start of group
      // set current expression as the new parent
      if (isBase) this._CurrParentExprBase = expr;
      else this._CurrParentExpr = expr;
    } else if (
      expr.groupEnd ||
      expr.logicalAndGroupEnd ||
      expr.logicalOrGroupEnd
    ) {
      // end of group
      // set parent of the expression as the new parent
      if (isBase) this._CurrParentExprBase = expr.parent;
      else this._CurrParentExpr = expr.parent;
    }
  }

  public LeftLinkedTo(
    tableCode: string,
    values?: any,
    clearFilter?: boolean
  ): DataOption {
    return this.PushLinkFilter(tableCode, values, clearFilter);
  }

  public RightLinkedTo(
    tableCode: string,
    values?: any,
    clearFilter?: boolean
  ): DataOption {
    return this.PushLinkFilter(tableCode, values, clearFilter, true);
  }
  private PushLinkFilter(
    tableCode: string,
    values?: any,
    clearFilter?: boolean,
    isRight?: boolean
  ): DataOption {
    if (!isRight) isRight = false;
    if (clearFilter) this.SubFilterClear;
    let fieldParam: IFieldDefParam = {
      fieldName: isRight ? '>' : '<' + tableCode,
    };
    this.PushExpression({
      fieldParam: fieldParam,
      value: values,
    });
    return this;
  }

  public Equal(
    fieldParam: IFieldDefParam,
    value: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'eq',
      value: value,
    });
    return this;
  }

  public NotEqual(
    fieldParam: IFieldDefParam,
    value: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'neq',
      value: value,
    });
    return this;
  }
  public LessThan(
    fieldParam: IFieldDefParam,
    value: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'lt',
      value: value,
    });

    return this;
  }
  public LessThanOrEqual(
    fieldParam: IFieldDefParam,
    value: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'lte',
      value: value,
    });
    return this;
  }
  public GreaterThan(
    fieldParam: IFieldDefParam,
    value: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'gt',
      value: value,
    });
    return this;
  }
  public GreaterThanOrEqual(
    fieldParam: IFieldDefParam,
    value: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'gte',
      value: value,
    });
    return this;
  }
  public In(
    fieldParam: IFieldDefParam,
    values: Array<any>,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'in',
      values: values,
    });
    return this;
  }
  public NotIn(
    fieldParam: IFieldDefParam,
    values: Array<any>,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'nin',
      values: values,
    });
    return this;
  }
  public Between(
    fieldParam: IFieldDefParam,
    value1: any,
    value2: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'btw',
      value1: value1,
      value2: value2,
    });
    return this;
  }
  public NotBetween(
    fieldParam: IFieldDefParam,
    value1: any,
    value2: any,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'nbtw',
      value1: value1,
      value2: value2,
    });
    return this;
  }
  public Like(
    fieldParam: IFieldDefParam,
    value: string,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'lk',
      value: value,
    });
    return this;
  }
  public NotLike(
    fieldParam: IFieldDefParam,
    value: string,
    clearFilter?: boolean
  ): DataOption {
    if (clearFilter) this.SubFilterClear;
    this.PushExpression({
      fieldParam: fieldParam,
      operator: 'nlk',
      value: value,
    });
    return this;
  }

  public get And(): DataOption {
    this.PushExpression({ logicalAnd: true });
    return this;
  }

  public get Or(): DataOption {
    this.PushExpression({ logicalOr: true });
    return this;
  }

  public get ANDS(): DataOption {
    // when this is encountered in the stack,
    // a flag will be raised that an AND group
    // operation has started
    this.PushExpression({ logicalAndGroupStart: true });
    return this;
  }
  public get ANDE(): DataOption {
    // when this is encountered in the stack,
    // a flag will be raised that an AND group
    // operation has ended
    this.PushExpression({ logicalAndGroupEnd: true });
    return this;
  }

  public get ORS(): DataOption {
    // when this is encountered in the stack,
    // a flag will be raised that an AND group
    // operation has started
    this.PushExpression({ logicalOrGroupStart: true });
    return this;
  }
  public get ORE(): DataOption {
    // when this is encountered in the stack,
    // a flag will be raised that an AND group
    // operation has ended
    this.PushExpression({ logicalOrGroupEnd: true });
    return this;
  }
  public get Not(): DataOption {
    this.PushExpression({ logicalNot: true });
    return this;
  }
  public get GroupStart(): DataOption {
    this.PushExpression({ groupStart: true });
    return this;
  }
  public get GroupEnd(): DataOption {
    this.PushExpression({ groupEnd: true });
    return this;
  }

  public get BaseFilterDefineOn(): DataOption {
    // turn on definition mode for Base Filter Expression
    // and clear BaseWhereTree array before starting
    // pushing logical expressions
    this.BaseWhereMode = true;
    this._BaseWhereTree = [];
    return this;
  }
  public get BaseFilterDefineOff(): DataOption {
    // turn off definition mode for Base Filter Expression
    this.BaseWhereMode = false;
    return this;
  }

  public get BaseFilterClear(): DataOption {
    // clear all entries in the base filter tree and set base where mode off
    this.BaseWhereMode = false;
    this._BaseWhereTree = [];
    return this;
  }

  public get SubFilterClear(): DataOption {
    // clear all entries in the base filter tree and set base where mode off
    this._WhereTree = [];
    return this;
  }

  public get AllFilterClear(): DataOption {
    // clear all entries in the base filter tree and set base where mode off
    this._WhereTree = [];
    this.BaseFilterClear;
    return this;
  }

  private _orderBy: Array<IFieldDefParam> = [];
  private _orderByBase: Array<IFieldDefParam> = [];

  public get OrderByClear(): DataOption {
    this._orderBy = [];
    return this;
  }

  public get OrderByClearBase(): DataOption {
    this._orderByBase = [];
    return this;
  }

  public OrderBy(tableFields: Array<IFieldDefParam>): DataOption {
    if (this.BaseWhereMode) {
      this._orderByBase = tableFields;
    } else {
      this._orderBy = tableFields;
    }
    return this;
  }
  public From(tableCode: string): DataOption {
    this.code = tableCode;
    return this;
  }

  public InnerJoin(args: {
    code: string;
    alias?: string;
    join?: SQLJoinChars;
    localField: string;
    foreignField?: string;
    leftJoin?: IFromClauseLink;
    innerJoin?: IFromClauseLink;
  }): DataOption {
    args.join = SQLJoinChars.INNER_JOIN_SYMBOL;
    this.fromLinks.push(args);
    return this;
  }
  public LeftJoin(args: IFromClauseLink): DataOption {
    args.join = SQLJoinChars.LEFT_JOIN_SYMBOL;
    this.fromLinks.push(args);
    return this;
  }

  public get FieldList(): string {
    // this will be set as the selected columns in the SQL statement

    const visibleFields: Array<DataColumn> = this.fields.filter(
      (f) => f.visible
    );

    let ret: string = '';

    visibleFields.forEach((c) => {
      // this.fields.forEach((c) => {
      const fldExpr = this.GetFieldExpression(c);
      // if field expression is not yet in the return list string
      // append fldExpr
      //if(c.requiredField)
      if (('`' + ret + '`').indexOf('`' + fldExpr + '`') == -1)
        ret += (ret.length == 0 ? '' : '`') + fldExpr;

      if (c.requiredFields) {
        console.log("c.requiredFields",c.requiredFields.join(","))
        c.requiredFields.forEach((fn) => {
          if (!visibleFields.find((vf) => vf.fieldName == fn)) {
            // if required field is not one of the visible fields
            const req = this.fields.find((rf) => rf.fieldName == fn);
            if (req) {
              const reqExpr = this.GetFieldExpression(req);
              if (('`' + ret + '`').indexOf('`' + reqExpr + '`') == -1)
                ret += (ret.length == 0 ? '' : '`') + reqExpr;
            }
          }
        });
      }
    });

    // console.log(
    //   'FieldList COLUMNS:',
    //   this.columns,
    //   'All fields:',
    //   this.fields,
    //   'Visible Fields:',
    //   visibleFields,
    //   'FieldList:',
    //   ret
    // );
    return ret;
  }
}

export enum SQLSelectFieldMode {
  ALL = '-',
  LEFT_JOIN_SYMBOL = '`',
  TABLE_CODE_SEPARATOR = '|',
  JOIN_SEPARATOR = ';',
  FIELD_SEPARATOR = ',',
  ALIAS_SEPARATOR = '@',
}

/********************************* filtering ***************************************/

export interface IFilterOperator {
  prmt: string;
  optr: string;
  apsw: number;
}

export enum FilterDataType {
  TEXT = 1,
  DATE = 2,
  NUMBER = 4,
  BOOLEAN = 8,
  MATRIX = 16,
  ASSET = 32,
  LOOKUP = 64,
}
