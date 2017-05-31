import { ModelSchema, RelationshipSchema, Model, ModelData, Schema } from 'plump';

export const ChildrenSchema: RelationshipSchema = {
  sides: {
    parents: { otherType: 'tests', otherName: 'children' },
    children: { otherType: 'tests', otherName: 'parents' },
  },
  storeData: {
    sql: {
      tableName: 'parent_child_relationship',
      joinFields: {
        parents: 'child_id',
        children: 'parent_id',
      },
    },
  }
};

export const ValenceChildrenSchema: RelationshipSchema = {
  sides: {
    valenceParents: { otherType: 'tests', otherName: 'valenceChildren' },
    valenceChildren: { otherType: 'tests', otherName: 'valenceParents' },
  },
  storeData: {
    sql: {
      tableName: 'valence_children',
      joinFields: {
        valenceParents: 'child_id',
        valenceChildren: 'parent_id',
      },
    },
  },
  extras: {
    perm: {
      type: 'number',
    },
  },
};

export const QueryChildrenSchema: RelationshipSchema = {

  sides: {
    queryParents: { otherType: 'tests', otherName: 'queryChildren' },
    queryChildren: { otherType: 'tests', otherName: 'queryParents' },
  },
  storeData: {
    sql: {
      tableName: 'query_children',
      joinFields: {
        queryParents: 'child_id',
        queryChildren: 'parent_id',
      },
      joinQuery: {
        queryParents: 'on "tests"."id" = "queryParents"."child_id" and "queryParents"."perm" >= 2',
        queryChildren: 'on "tests"."id" = "queryChildren"."parent_id" and "queryChildren"."perm" >= 2',
      },
      where: {
        queryParents: '"query_children"."child_id" = ? and "query_children"."perm" >= 2',
        queryChildren: '"query_children"."parent_id" = ? and "query_children"."perm" >= 2',
      },
    },
  },
  extras: {
    perm: {
      type: 'number',
    },
  },
};

export const TestSchema: ModelSchema = {
  name: 'tests',
  idAttribute: 'id',
  attributes: {
    id: { type: 'number', readOnly: true },
    name: { type: 'string', readOnly: false },
    otherName: { type: 'string', default: '', readOnly: false },
    extended: { type: 'object', default: {}, readOnly: false },
  },
  relationships: {
    children: { type: ChildrenSchema },
    parents: { type: ChildrenSchema },
    valenceChildren: { type: ValenceChildrenSchema },
    valenceParents: { type: ValenceChildrenSchema },
    queryChildren: { type: QueryChildrenSchema, readOnly: true },
    queryParents: { type: QueryChildrenSchema, readOnly: true },
  },
  storeData: {
    sql: {
      tableName: 'tests',
      bulkQuery: 'where "tests"."id" >= ?',
    },
  }
};

@Schema(TestSchema)
export class TestType extends Model<ModelData> { }
