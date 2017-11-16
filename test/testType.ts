import {
  ModelSchema,
  RelationshipSchema,
  Model,
  ModelData,
  Schema,
  RelationshipItem,
} from 'plump';

export const ChildrenSchema: RelationshipSchema = {
  sides: {
    parents: { otherType: 'tests', otherName: 'children' },
    children: { otherType: 'tests', otherName: 'parents' },
  },
};

export const ValenceChildrenSchema: RelationshipSchema = {
  sides: {
    valenceParents: { otherType: 'tests', otherName: 'valenceChildren' },
    valenceChildren: { otherType: 'tests', otherName: 'valenceParents' },
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
  },
};

export interface PermRelationshipItem extends RelationshipItem {
  meta: {
    perm: number;
  };
}

export interface TestData extends ModelData {
  type: 'tests';
  id: number;
  attributes?: {
    id: number;
    name: string;
    otherName: string;
    extended: { [key: string]: any };
  };
  relationships?: {
    children: RelationshipItem[];
    parents: RelationshipItem[];
    valenceChildren: PermRelationshipItem[];
    valenceParents: PermRelationshipItem[];
  };
}

@Schema(TestSchema)
export class TestType extends Model<TestData> {
  static type = 'tests';
}
