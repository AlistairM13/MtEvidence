import asyncHandler from "express-async-handler";
import skillsModel from "../models/skillsModel";

type SkillsPayload = {
  id: string;
  userId: string;
  name: string;
  imageInHead: string;
  progress: number;
  journal: JournalEntryPayload[];
};

type JournalEntryPayload = {
  timestamp: number;
  entry: string;
};

type SkillPayload = {
  name: string;
  userId: string;
  imageInHead: string;
};

export const getAllSkillsByUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.user!;

  if (!userId) {
    res.status(401);
    throw new Error("User not logged in");
  }

  const response = await skillsModel.find({
    userId,
  });

  if (response) {
    res.status(201).json(response);
  } else {
    res.status(400);
    throw new Error("Error fetching skills");
  }
});

export const addNewSkill = asyncHandler(async (req, res) => {
  const { name, imageInHead }: SkillPayload = req.body;
  if (!name || !imageInHead) {
    res.status(400);
    throw new Error("Missing request parameters");
  }

  const { id: userId } = req.user!;

  const response = await skillsModel.create({
    name,
    imageInHead,
    userId,
  });

  if (response) {
    res.status(201).json({
      ...response,
      progress: 0,
      journal: [],
    });
  } else {
    res.status(400);
    throw new Error("Error adding new skill");
  }
});

export const updateSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;
  const { name, imageInHead, id, journal, progress, userId }: SkillsPayload =
    req.body;

  if (!name || !imageInHead || !skillId || !id || !userId) {
    res.status(400);
    throw new Error("Missing request parameters");
  }

  const skillExists = await skillsModel.findById(skillId);
  if (!skillExists) {
    res.status(404);
    throw new Error("Skill does not exist");
  }

  const user = req.user!;
  if (!user) {
    res.status(401);
    throw new Error("User not logged in");
  }

  if (user.id !== userId) {
    res.status(403);
    throw new Error("You are not allowed to update this skills");
  }

  const response = await skillsModel.findByIdAndUpdate(skillId, {
    name,
    imageInHead,
    id,
    journal,
    progress,
    userId,
  });
  if (response) {
    res.status(201).json({ message: "Skill updated successfully" });
  } else {
    res.status(400);
    throw new Error("Error adding new skill");
  }
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const user = req.user!;
  if (!user) {
    res.status(401);
    throw new Error("User not logged in");
  }

  const skillExists = await skillsModel.findById(skillId);
  if (!skillExists) {
    res.status(404);
    throw new Error("Skill does not exist");
  }

  if (user.id !== skillExists.userId.toString()) {
    res.status(403);
    throw new Error("You are not allowed to update this skills");
  }

  const response = await skillsModel.findByIdAndDelete(skillId);

  if (response) {
    res.status(201).json(response);
  } else {
    res.status(400);
    throw new Error("Error deleting skill");
  }
});

export const syncAllSkills = asyncHandler(async (req, res) => {
  const { skills }: { skills: SkillsPayload[] } = req.body;

  // Validate that the request body is an array
  if (!Array.isArray(skills)) {
    res.status(400);
    throw new Error("Request body should be an array skills.");
  }

  const { id: userId } = req.user!;
  if (!userId) {
    res.status(401);
    throw new Error("Not logged in");
  }

  const results = await Promise.allSettled(
    skills.map(async (skill) => {
      try {
        if (skill.userId !== userId) {
          throw new Error("Not authorized to alter this skill");
        }

        const response = await skillsModel.findByIdAndUpdate(skill.id, skill);

        if (response) {
          return { success: true, data: response };
        }

        throw new Error(`${skill.name}-Failed to add skill data`);
      } catch (error: any) {
        return Promise.reject(new Error(error.message));
      }
    })
  );

  // Transform results to make them JSON-friendly
  const jsonFriendlyResults = results.map((result) => ({
    status: result.status,
    ...(result.status === "fulfilled"
      ? {
          message: "Skill added",
          skillName: result.value.data.name,
        }
      : {
          message: result.reason.message,
        }),
  }));

  // Check if there are any failures
  const hasFailures = jsonFriendlyResults.some(
    (result) => result.status === "rejected"
  );

  // Set the appropriate status code
  res.status(hasFailures ? 207 : 201).json(jsonFriendlyResults);
});
