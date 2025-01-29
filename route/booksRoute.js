import express from "express";
import { book } from "../models/bookModel.js"; // Ensure consistent naming
import { verifyToken } from "../authMiddleware.js";

const router = express.Router(); // Correctly initialize the router

// Create a new book
router.post("/", verifyToken, async (request, response) => {
  console.log(request.body);
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishyear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishyear",
      });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishyear: request.body.publishyear,
      userId: request.user.id,
    };

    const createdBook = await book.create(newBook);
    return response.status(201).send(createdBook);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get a book by ID
router.get("/:id", verifyToken, async (request, response) => {
  try {
    const { id } = request.params;
    const foundBook = await book.findById(id);
    if (!foundBook) {
      return response.status(404).send({ message: "Book not found" });
    }
    return response.status(200).json(foundBook);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all books for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const foundBooks = await book.find({ userId: req.user.id });
    console.log("userd", req.user.userId);

    return res.status(200).json({
      count: foundBooks.length,
      data: foundBooks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update a book by ID
router.put("/:id", verifyToken, async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.title || !req.body.author || !req.body.publishyear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishyear",
      });
    }

    const { id } = req.params;
    const foundBook = await book.findById(id);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update the book
    const result = await book.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).send({
      message: "Book updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete a book by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const foundBook = await book.findById(id);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the book
    await book.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
