import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Budget } from "@/types";

export async function GET(request: Request) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let query = {};
    if (month && year) {
      query = { month, year: parseInt(year) };
    }

    const budgets = await db.collection("budgets").find(query).toArray();

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase();
    const budget: Omit<Budget, "_id"> = await request.json();

    // Check if budget already exists for this category, month, and year
    const existingBudget = await db.collection("budgets").findOne({
      category: budget.category,
      month: budget.month,
      year: budget.year,
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: "Budget already exists for this category and month" },
        { status: 400 }
      );
    }

    const newBudget = {
      ...budget,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("budgets").insertOne(newBudget);

    return NextResponse.json({ ...newBudget, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getDatabase();
    const { ObjectId } = await import("mongodb");
    const budget: Budget = await request.json();

    if (!budget._id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    const { _id, ...updateData } = budget;
    const result = await db.collection("budgets").updateOne(
      { _id: new ObjectId(_id.toString()) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDatabase();
    const { ObjectId } = await import("mongodb");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    const result = await db.collection("budgets").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
