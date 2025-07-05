# Copilot Instructions for Personal Finance Visualizer

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Personal Finance Visualizer web application built with Next.js, React, TypeScript, shadcn/ui, Recharts, and MongoDB. The application helps users track personal finances with transaction management, categorization, and budgeting features.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: MongoDB for data storage
- **Icons**: Lucide React icons

## Key Features

1. **Transaction Management**: Add, edit, delete transactions with amount, date, and description
2. **Categorization**: Predefined categories for transactions
3. **Visualization**: Monthly expenses bar chart and category-wise pie chart
4. **Budgeting**: Set monthly budgets and track spending vs budget
5. **Responsive Design**: Mobile-first approach with error handling

## Development Guidelines

- Use TypeScript for all components and API routes
- Follow shadcn/ui component patterns and styling
- Implement proper error handling and loading states
- Use MongoDB for data persistence
- Ensure responsive design for mobile and desktop
- Follow Next.js App Router conventions
- Use proper form validation for user inputs

## File Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and database connections
- `/src/types` - TypeScript type definitions

## Note

This project does not implement authentication/login as per requirements.
