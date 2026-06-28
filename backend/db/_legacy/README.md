# Legacy SQL Schema Reference

These files contain the original MySQL schema references (from the initial planning phase).

The project now uses **MongoDB** with Mongoose ODM. All schema definitions are in
`src/modules/*/schemas/` as Mongoose schemas.

## Migration Notes

- If migrating from MySQL to MongoDB, these SQL files serve as a reference
  for the original relational model.
- The Mongoose schemas may have diverged from these SQL definitions.
  Always refer to `src/modules/*/schemas/` for the current schema.
