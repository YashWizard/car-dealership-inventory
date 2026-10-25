# Manual Acceptance Checklist

Check an item only after performing it successfully.
Unchecked items are not claimed as verified.

## Public pages and authentication
- [ ] Landing page and local hero image render.
- [ ] Collection navigation and sign-in entry work.
- [ ] New customer registration succeeds.
- [ ] Customer can sign out and log back in.
- [ ] Incorrect password is rejected.
- [ ] Admin login succeeds.

## Inventory
- [ ] Vehicle list shows ID, make, model, category, price, and stock.
- [ ] Make, model, and category filters return matching vehicles.
- [ ] Price-range filtering returns matching vehicles.
- [ ] Invalid price range is rejected.
- [ ] No-match search shows an empty state.
- [ ] Reset restores current inventory.
- [ ] Admin can add and edit a temporary vehicle.
- [ ] Purchase decreases its stock by exactly one.
- [ ] Zero stock disables Purchase.
- [ ] Restock adds the requested positive quantity.
- [ ] Invalid restock quantities are rejected.
- [ ] Customer does not see admin management controls.
- [ ] Customer can purchase available stock.
- [ ] Cancelled deletion preserves the vehicle.
- [ ] Confirmed deletion removes it.
- [ ] Changes remain after a browser reload.
- [ ] Inventory remains after a controlled backend restart.

## Presentation
- [ ] Mobile layout has no horizontal overflow.
- [ ] No application-breaking browser Console errors remain.

## Authorization note
Frontend control visibility does not prove backend authorization.
Backend delete/restock restrictions must be enforced independently.

## Observed failures or limitations
Record unresolved issues here.
