import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Transaction } from "@/types";
import { ObjectId } from "mongodb";
import { validateTransaction } from "@/lib/utils-finance";

export async function GET() {
  try {
    const db = await getDatabase();
    const transactions = await db
      .collection<Transaction>("transactions")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, date, description, type, category } = body;

    const validation = validateTransaction({ amount, date, description, type });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const transaction: Omit<Transaction, "_id"> = {
      amount: parseFloat(amount),
      date,
      description,
      type,
      category: category || "Other",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Transaction>("transactions")
      .insertOne(transaction);

    const createdTransaction = await db
      .collection<Transaction>("transactions")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(createdTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, amount, date, description, type, category } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const validation = validateTransaction({ amount, date, description, type });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const updateData = {
      amount: parseFloat(amount),
      date,
      description,
      type,
      category: category || "Other",
      updatedAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const updatedTransaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(_id) });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db
      .collection("transactions")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
