import { test } from 'ember-qunit';
import { run } from '@ember/runloop';
import { moduleForPact } from 'ember-cli-pact';

moduleForPact('Pact | People');

test('listing people', async function(assert) {
  this.given('a department exists', { id: '1', name: 'People' });
  this.given('a person exists', { id: '1', name: 'Alice', departmentId: '1' });
  this.given('a person exists', { id: '2', name: 'Bob', departmentId: '1' });

  const people = await this.interaction(() => this.store().findAll('person'));

  assert.deepEqual(people.mapBy('id'), ['1', '2']);
  assert.deepEqual(people.mapBy('name'), ['Alice', 'Bob']);
  assert.deepEqual(people.mapBy('department.name'), ['People', 'People']);
});

test('fetching a person by ID', async function(assert) {
  this.given('a person exists', { id: '1', name: 'Alice' });

  const person = await this.interaction(() => this.store().findRecord('person', '1'));

  assert.equal(person.get('id'), '1');
  assert.equal(person.get('name'), 'Alice');
});

test('updating a person', async function assert(assert) {
  this.given('a person exists', { id: '1', name: 'Alice' });

  const store = this.store();
  const person = await run(() => store.findRecord('person', '1'));

  await this.interaction(() => {
    person.set('name', 'Alicia');
    return person.save();
  });

  assert.equal(person.get('name'), 'Alicia');
});
