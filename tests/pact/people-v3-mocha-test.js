import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupPact, given, interaction } from 'ember-cli-pact';
import { assert } from 'chai';
import { run } from '@ember/runloop';

describe('Pact | People', function() {
  setupTest({ integration: true });
  setupPact();

  it('listing people', async function() {
    given('a department exists', { id: '1', name: 'People' });
    given('a person exists', { id: '1', name: 'Alice', departmentId: '1' });
    given('a person exists', { id: '2', name: 'Bob', departmentId: '1' });

    let people = await interaction(() => this.store().findAll('person'));

    assert.deepEqual([...people.mapBy('id')], ['1', '2']);
    assert.deepEqual([...people.mapBy('name')], ['Alice', 'Bob']);
    assert.deepEqual([...people.mapBy('department.name')], ['People', 'People']);
  });

  it('querying people', async function() {
    given('a person exists', { id: '1', name: 'Alice' });
    given('a person exists', { id: '2', name: 'Bob' });

    let people = await interaction(() => this.store().query('person', { name: 'Bob' }));

    assert.equal(people.get('length'), 1);
    assert.equal(people.get('firstObject.id'), '2');
    assert.equal(people.get('firstObject.name'), 'Bob');
  });

  it('fetching a person by ID', async function() {
    given('a person exists', { id: '1', name: 'Alice' });

    let person = await interaction(() => this.store().findRecord('person', '1'));

    assert.equal(person.get('id'), '1');
    assert.equal(person.get('name'), 'Alice');
  });

  it('updating a person', async function() {
    given('a person exists', { id: '1', name: 'Alice' });

    let person = await run(() => this.store().findRecord('person', '1'));

    await interaction(() => {
      person.set('name', 'Alicia');
      return person.save();
    });

    assert.equal(person.get('name'), 'Alicia');
  });
});
