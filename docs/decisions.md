# Implementation Decisions

These decisions clarify behavior not fully specified in the assignment.

## Database

Use persistent, file-backed SQLite.

## Roles

Public registration creates ordinary users only.
An admin will be created using a documented local seed command.

## Permission interpretation

The brief explicitly restricts delete and restock to admins.
Backend create/update operations are described as authenticated
without an explicit admin restriction.

Our interpretation:
- Authenticated users may call create/update API endpoints.
- The required inventory management interface is presented to admins.
- Delete and restock require server-side admin authorization.

## Inventory

Purchase removes exactly one unit.
Restock accepts a positive integer.
Stock must never become negative.

## Zero-stock vehicles

Remain visible with an Out of stock label and disabled Purchase button.

## Search

Make/model matching is case-insensitive.
Category matching is case-insensitive.
Multiple filters use AND.
Price-range boundaries are inclusive.

## Currency

Use INR consistently and document the stored price units.

## Payments

Not included. Purchase represents inventory reduction.
