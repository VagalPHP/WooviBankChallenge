# WooviBankChallenge

An example of a bank application for Woovi's challenge.

# Quickstart

- Environment Configuration
    - Set Mongo Connection String
    - Set Server PORT
- Run tests
- Start application

# Project Documentation

## Schemas

---

## Account

**Collection Name**: `accounts`

| **Field**       | **Type**                           | **Description**                                                              | **Required** | **Default** |
|-----------------|------------------------------------|------------------------------------------------------------------------------|--------------|-------------|
| `accountNumber` | `String`                           | A unique identifier for the account, used as the account number.             | Yes          | None        |
| `balance`       | `Number`                           | The current balance of the account.                                          | Yes          | None        |
| `user`          | `mongoose.Schema.Types.ObjectId`   | Reference to the `User` who owns the account.                                | Yes          | None        |
| `transactions`  | `[mongoose.Schema.Types.ObjectId]` | Array of references to `Transaction` documents associated with this account. | No           | []          |
| `createdAt`     | `Date`                             | Timestamp of when the account was created.                                   | Yes          | `Date.now`  |
| `updatedAt`     | `Date`                             | Timestamp of when the account was last updated.                              | Yes          | `Date.now`  |

**Example Document**:

```json
{
  "accountNumber": "12345678",
  "balance": 1000,
  "user": "507f191e810c19729de860ea",
  "transactions": [
    "507f191e810c19729de860eb",
    "507f191e810c19729de860ec"
  ],
  "createdAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2024-11-01T11:00:00Z"
}
```

## Transaction

### Schema

**Collection Name**: `transactions`

| **Field**     | **Type**                         | **Description**                                              | **Required** | **Default** |
|---------------|----------------------------------|--------------------------------------------------------------|--------------|-------------|
| `amount`      | `Number`                         | The transaction amount.                                      | Yes          | None        |
| `date`        | `Date`                           | The date when the transaction occurred.                      | No           | `Date.now`  |
| `account`     | `mongoose.Schema.Types.ObjectId` | Reference to the `Account` associated with this transaction. | Yes          | None        |
| `description` | `String`                         | Description or note for the transaction.                     | No           | None        |

### Example Document

```json
{
  "amount": 500.50,
  "date": "2024-11-01T14:30:00Z",
  "account": "507f191e810c19729de860ea",
  "description": "Payment for services"
}
```

## User

### Schema

**Collection Name**: `users`

| **Field**   | **Type**                           | **Description**                                               | **Required** | **Default** |
|-------------|------------------------------------|---------------------------------------------------------------|--------------|-------------|
| `name`      | `String`                           | Full name of the user.                                        | Yes          | None        |
| `email`     | `String`                           | Unique email address of the user.                             | Yes          | None        |
| `password`  | `String`                           | Hashed password for the user's authentication.                | Yes          | None        |
| `accounts`  | `[mongoose.Schema.Types.ObjectId]` | Array of references to `Account` documents owned by the user. | No           | []          |
| `createdAt` | `Date`                             | Timestamp indicating when the user was created.               | Yes          | `Date.now`  |
| `updatedAt` | `Date`                             | Timestamp indicating the last update of the user.             | Yes          | `Date.now`  |

### Example Document

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedPassword123",
  "accounts": [
    "507f191e810c19729de860eb"
  ],
  "createdAt": "2024-11-01T09:00:00Z",
  "updatedAt": "2024-11-01T10:00:00Z"
}
```

# Stack

Mongoose: https://mongoosejs.com/
Graphql: 