const Announcement = require("../models/Announcement");
const { AnnouncementSchema } = require("../validations/user");

exports.createAnnouncement = async (req, res) => {
    const body = AnnouncementSchema.safeParse(req.body);

    if (!body.success) return res.status(400).json({ error: body.error.issues });

    try {
        const announcement = new Announcement({ title:body.data.title,  description: body.data.description ,});
        await announcement.save();
        return res
        .status(201)
        .json({ message: "Announcement Created Succesfully", announcement });
        // const existingAnnouncement = await Announcement.findOne({ uniqueField: 'single_announcement_status' });
    } catch (error) {
        console.log("CREATE ANNOUNCEMENT ERROR=>", error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
              details: error.message,
            },
          ],
        });
      }
}

exports.getLatestAnnouncement = async (req, res) => {
    try {
        const latestAnnouncement = await Announcement
            .find()
            .sort({ createdAt: -1 }) // Sort in descending order based on createdAt
            .limit(1); // Limit the result to 1

        if (latestAnnouncement.length === 0) {
            return res.status(404).json({ message: "No announcements found" });
        }

        return res.status(200).json({ latestAnnouncement: latestAnnouncement[0] });
    } catch (error) {
        console.log("GET LATEST ANNOUNCEMENT ERROR =>", error);
        return res.status(500).json({
            errors: [
                {
                    error: "Server Error",
                    details: error.message,
                },
            ],
        });
    }
};
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement
            .find();

        if (announcements.length === 0) {
            return res.status(404).json({ message: "No announcements found" });
        }

        return res.status(200).json({ announcements: announcements });
    } catch (error) {
        console.log("GET LATEST ANNOUNCEMENT ERROR =>", error);
        return res.status(500).json({
            errors: [
                {
                    error: "Server Error",
                    details: error.message,
                },
            ],
        });
    }
};