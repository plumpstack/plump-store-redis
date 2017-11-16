/* eslint-env node */
/* eslint no-shadow: 0, max-len: 0 */

import { TestType } from './testType';
import {
  MemoryStore,
  Plump,
  Model,
  ModelData,
  Schema,
  TerminalStore,
} from 'plump';
import mergeOptions from 'merge-options';

import * as chai from 'chai';

const expect = chai.expect;

const sampleObject = {
  type: TestType.type,
  attributes: {
    name: 'potato',
    extended: {
      actual: 'rutabaga',
      otherValue: 42,
    },
  },
  relationships: {},
};

export function testSuite(context, storeOpts) {
  const store = Object.assign(
    {},
    {
      before: () => Promise.resolve(),
      after: () => Promise.resolve(),
    },
    storeOpts,
  );
  context.describe(store.name, () => {
    let actualStore: TerminalStore;
    context.before(() => {
      return (store.before || (() => Promise.resolve()))(actualStore).then(
        () => {
          actualStore = new store.ctor(store.opts); // eslint-disable-line new-cap
          actualStore.addSchema(TestType);
        },
      );
    });

    context.describe('core CRUD', () => {
      context.it(
        'supports creating values with no id field, and retrieving values',
        () => {
          return actualStore
            .writeAttributes(sampleObject)
            .then(createdObject => {
              return actualStore
                .read({
                  item: { type: TestType.type, id: createdObject.id },
                  fields: ['attributes', 'relationships'],
                })
                .then(v => {
                  return expect(v).to.deep.equal(
                    mergeOptions({}, sampleObject, {
                      id: createdObject.id,
                      relationships: {
                        parents: [],
                        children: [],
                        valenceParents: [],
                        valenceChildren: [],
                      },
                      attributes: {
                        id: createdObject.id,
                        otherName: '',
                      },
                    }),
                  );
                });
            });
        },
      );

      context.it('allows objects to be stored by id', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          const modObject = mergeOptions({}, createdObject, {
            attributes: { name: 'carrot' },
          });
          return actualStore.writeAttributes(modObject).then(updatedObject => {
            return actualStore
              .read({
                item: { type: TestType.type, id: updatedObject.id },
                fields: ['attributes'],
              })
              .then(v => {
                expect(v.id).to.equal(createdObject.id);
                expect(v.attributes.id).to.equal(createdObject.id);
                expect(v.attributes.name).to.equal(modObject.attributes.name);
                expect(v.attributes.otherName).to.equal('');
              });
          });
        });
      });

      context.it('supports storing and retrieving dates in Date format', () => {
        @Schema({
          name: 'datedTests',
          idAttribute: 'id',
          attributes: {
            id: { type: 'number', readOnly: true },
            name: { type: 'string' },
            when: { type: 'date' },
          },
          relationships: {},
        })
        class DatedType extends Model<ModelData> {
          static type = 'datedTests';
        }
        return actualStore.addSchema(DatedType).then(() => {
          const theDate = new Date();
          return actualStore
            .writeAttributes({
              type: 'datedTests',
              attributes: {
                name: 'datarino',
                when: theDate,
              },
            })
            .then(inserted => {
              return actualStore.read({
                item: { type: 'datedTests', id: inserted.id },
                fields: ['attributes', 'relationships'],
              });
            })
            .then(v => {
              expect(v.attributes.when instanceof Date).to.equal(true);
              expect(v.attributes.when.getTime()).to.equal(theDate.getTime());
            });
        });
      });

      context.it('allows for deletion of objects by id', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          return actualStore
            .read({
              item: { type: TestType.type, id: createdObject.id },
              fields: ['attributes', 'relationships'],
            })
            .then(v =>
              expect(v).to.have.nested.property('attributes.name', 'potato'),
            )
            .then(() =>
              actualStore.delete({ type: TestType.type, id: createdObject.id }),
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['attributes', 'relationships'],
              }),
            )
            .then(v => expect(v).to.be.null);
        });
      });
    });

    context.describe('relationships', () => {
      context.it('can fetch a base and hasmany in one read', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          return actualStore
            .writeRelationshipItem(
              { type: TestType.type, id: createdObject.id },
              'children',
              { id: 200 },
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 201 },
              ),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 202 },
              ),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 203 },
              ),
            )
            .then(() => {
              return actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['attributes', 'relationships.children'],
              });
            })
            .then(v => {
              expect(v).to.have.nested.property('attributes.name', 'potato');
              expect(v.relationships.children).to.deep.equal(
                [200, 201, 202, 203].map(id => ({ type: TestType.type, id })),
              );
            });
        });
      });

      context.it('can add to a hasMany relationship', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          return actualStore
            .writeRelationshipItem(
              { type: TestType.type, id: createdObject.id },
              'children',
              { id: 100 },
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 101 },
              ),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 102 },
              ),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 103 },
              ),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: 100 },
                'children',
                { id: createdObject.id },
              ),
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.children'],
              }),
            )
            .then(v => {
              expect(v.relationships.children).to.deep.equal([
                { type: TestType.type, id: 100 },
                { type: TestType.type, id: 101 },
                { type: TestType.type, id: 102 },
                { type: TestType.type, id: 103 },
              ]);
              return actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.parents'],
              });
            })
            .then(v =>
              expect(v.relationships.parents).to.deep.equal([
                { type: TestType.type, id: 100 },
              ]),
            );
        });
      });

      context.it('can add to a hasMany relationship with extras', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          return actualStore
            .writeRelationshipItem(
              { type: TestType.type, id: createdObject.id },
              'valenceChildren',
              { id: 100, meta: { perm: 1 } },
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.valenceChildren'],
              }),
            )
            .then(v =>
              expect(v.relationships.valenceChildren).to.deep.equal([
                { type: TestType.type, id: 100, meta: { perm: 1 } },
              ]),
            );
        });
      });

      context.it('can modify valence on a hasMany relationship', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          return actualStore
            .writeRelationshipItem(
              { type: TestType.type, id: createdObject.id },
              'valenceChildren',
              { id: 100, meta: { perm: 1 } },
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.valenceChildren'],
              }),
            )
            .then(v =>
              expect(v.relationships.valenceChildren).to.deep.equal([
                { type: TestType.type, id: 100, meta: { perm: 1 } },
              ]),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'valenceChildren',
                { type: TestType.type, id: 100, meta: { perm: 2 } },
              ),
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.valenceChildren'],
              }),
            )
            .then(v =>
              expect(v.relationships.valenceChildren).to.deep.equal([
                { type: TestType.type, id: 100, meta: { perm: 2 } },
              ]),
            );
        });
      });

      context.it('can remove from a hasMany relationship', () => {
        return actualStore.writeAttributes(sampleObject).then(createdObject => {
          return actualStore
            .writeRelationshipItem(
              { type: TestType.type, id: createdObject.id },
              'children',
              { type: TestType.type, id: 100 },
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.children'],
              }),
            )
            .then(v =>
              expect(v.relationships.children).to.deep.equal([
                { type: TestType.type, id: 100 },
              ]),
            )
            .then(() =>
              actualStore.deleteRelationshipItem(
                { type: TestType.type, id: createdObject.id },
                'children',
                { id: 100 },
              ),
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: createdObject.id },
                fields: ['relationships.children'],
              }),
            )
            .then(v => expect(v.relationships.children).to.deep.equal([]));
        });
      });
    });

    context.describe('events', () => {
      context.it(
        'should pass basic write-invalidation events to other datastores',
        () => {
          const memstore = new MemoryStore();
          const testPlump = new Plump(actualStore as TerminalStore);
          return testPlump
            .addCache(memstore)
            .then(() => testPlump.addType(TestType))
            .then(() =>
              actualStore.writeAttributes({
                type: TestType.type,
                attributes: { name: 'potato' },
              }),
            )
            .then(createdObject => {
              return actualStore
                .read({
                  item: { type: TestType.type, id: createdObject.id },
                  fields: ['attributes', 'relationships'],
                })
                .then(() => {
                  return new Promise(resolve => setTimeout(resolve, 100))
                    .then(() =>
                      memstore.read({
                        item: {
                          type: TestType.type,
                          id: createdObject.id,
                        },
                        fields: ['attributes', 'relationships'],
                      }),
                    )
                    .then(v =>
                      expect(v).to.have.nested.property(
                        'attributes.name',
                        'potato',
                      ),
                    )
                    .then(() => {
                      return actualStore.writeAttributes({
                        type: TestType.type,
                        id: createdObject.id,
                        attributes: {
                          name: 'grotato',
                        },
                      });
                    })
                    .then(
                      () => new Promise(resolve => setTimeout(resolve, 100)),
                    )
                    .then(() =>
                      memstore.read({
                        item: {
                          type: TestType.type,
                          id: createdObject.id,
                        },
                        fields: ['attributes', 'relationships'],
                      }),
                    )
                    .then(v => expect(v).to.be.null);
                });
            })
            .then(() => {
              return testPlump.teardown();
            })
            .catch(err => {
              testPlump.teardown();
              throw err;
            });
        },
      );

      context.it('should pass basic cacheable-read events up the stack', () => {
        let testItem;
        const memstore = new MemoryStore();
        return actualStore
          .writeAttributes({
            type: TestType.type,
            attributes: { name: 'potato' },
          })
          .then(createdObject => {
            testItem = createdObject;
            return actualStore.read({
              item: { type: TestType.type, id: testItem.id },
              fields: ['attributes', 'relationships'],
            });
          })
          .then(v =>
            expect(v).to.have.nested.property('attributes.name', 'potato'),
          )
          .then(() => {
            const testPlump = new Plump(actualStore);
            return testPlump
              .addType(TestType)
              .then(() => testPlump.addCache(memstore));
          })
          .then(() =>
            memstore.read({
              item: { type: TestType.type, id: testItem.id },
              fields: ['attributes', 'relationships'],
            }),
          )
          .then(v => expect(v).to.be.null)
          .then(() =>
            actualStore.read({
              item: { type: TestType.type, id: testItem.id },
              fields: ['attributes', 'relationships'],
            }),
          )
          .then(() => {
            // NOTE: this timeout is a hack, it is because
            // cacheable read events trigger multiple async things, but don't block
            // the promise from returning
            return new Promise(resolve => setTimeout(resolve, 100));
          })
          .then(() =>
            memstore.read({
              item: { type: TestType.type, id: testItem.id },
              fields: ['attributes', 'relationships'],
            }),
          )
          .then(v =>
            expect(v).to.have.nested.property('attributes.name', 'potato'),
          );
      });

      context.it(
        'should pass write-invalidation events on hasMany relationships to other datastores',
        () => {
          let testItem;
          const memstore = new MemoryStore();
          const testPlump = new Plump(actualStore);
          return testPlump
            .addType(TestType)
            .then(() => testPlump.addCache(memstore))
            .then(() =>
              actualStore.writeAttributes({
                type: TestType.type,
                attributes: { name: 'potato' },
              }),
            )
            .then(createdObject => {
              testItem = createdObject;
              return actualStore.read({
                item: { type: TestType.type, id: testItem.id },
                fields: ['attributes', 'relationships'],
              });
            })
            .then(v =>
              expect(v).to.have.nested.property('attributes.name', 'potato'),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: testItem.id },
                'children',
                { type: TestType.type, id: 100 },
              ),
            )
            .then(() =>
              memstore.read({
                item: { type: TestType.type, id: testItem.id },
                fields: ['attributes', 'relationships'],
              }),
            )
            .then(v =>
              expect(v).to.not.have.nested.property('relationships.children'),
            )
            .then(() =>
              actualStore.read({
                item: { type: TestType.type, id: testItem.id },
                fields: ['relationships.children'],
              }),
            )
            .then(() => {
              // NOTE: this timeout is a hack, it is because
              // cacheable read events trigger multiple async things, but don't block
              // the promise from returning
              return new Promise(resolve => setTimeout(resolve, 100));
            })
            .then(() =>
              memstore.read({
                item: { type: TestType.type, id: testItem.id },
                fields: ['relationships.children'],
              }),
            )
            .then(v =>
              expect(v.relationships.children).to.deep.equal([
                { type: TestType.type, id: 100 },
              ]),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: testItem.id },
                'children',
                { id: 101 },
              ),
            )
            .then(() => new Promise(resolve => setTimeout(resolve, 100)))
            .then(() =>
              memstore.read({
                item: { type: TestType.type, id: testItem.id },
                fields: ['attributes', 'relationships'],
              }),
            )
            .then(v =>
              expect(v).to.not.have.nested.property('relationships.children'),
            )
            .then(() => testPlump.teardown())
            .catch(err => {
              testPlump.teardown();
              throw err;
            });
        },
      );

      context.it(
        'should pass cacheable-read events on hasMany relationships to other datastores',
        () => {
          let testItem;
          return actualStore
            .writeAttributes({
              type: TestType.type,
              attributes: { name: 'potato' },
            })
            .then(createdObject => {
              testItem = createdObject;
              return actualStore.read({
                item: { type: TestType.type, id: testItem.id },
                fields: ['attributes', 'relationships'],
              });
            })
            .then(v =>
              expect(v).to.have.nested.property('attributes.name', 'potato'),
            )
            .then(() =>
              actualStore.writeRelationshipItem(
                { type: TestType.type, id: testItem.id },
                'children',
                { type: TestType.type, id: 100 },
              ),
            )
            .then(() => {
              const testPlump = new Plump(actualStore);
              const memstore = new MemoryStore();
              return testPlump
                .addType(TestType)
                .then(() => {
                  return testPlump
                    .addCache(memstore)
                    .then(() =>
                      memstore.read({
                        item: { type: TestType.type, id: testItem.id },
                        fields: ['attributes', 'relationships'],
                      }),
                    )
                    .then(v => expect(v).to.be.null);
                })
                .then(() => {
                  return actualStore.read({
                    item: { type: TestType.type, id: testItem.id },
                    fields: ['relationships.children'],
                  });
                })
                .then(() => new Promise(resolve => setTimeout(resolve, 100)))
                .then(() =>
                  memstore.read({
                    item: { type: TestType.type, id: testItem.id },
                    fields: ['children'],
                  }),
                )
                .then(v =>
                  expect(v.relationships.children).to.deep.equal([
                    { type: TestType.type, id: 100 },
                  ]),
                )
                .then(() => testPlump.teardown())
                .catch(err => {
                  testPlump.teardown();
                  throw err;
                });
            });
        },
      );
    });

    context.after(() => {
      return (store.after ||
        (() => {
          return;
        }))(actualStore);
    });
  });
}
