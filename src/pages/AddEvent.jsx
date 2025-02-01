import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function AddEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner: user ? user.name : "",
    title: "",
    optional: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: "",
    image: null, // Store file instead of empty string
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({ ...prevState, image: file }));
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Validation function
  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.organizedBy.trim()) newErrors.organizedBy = "Organizer name is required";
    if (!formData.eventDate) newErrors.eventDate = "Event date is required";
    if (!formData.eventTime) newErrors.eventTime = "Event time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.ticketPrice === "" || isNaN(formData.ticketPrice) || formData.ticketPrice < 0) {
      newErrors.ticketPrice = "Valid ticket price is required";
    }
    if (!formData.image) newErrors.image = "Event image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Set loading to true when submitting

    const eventData = new FormData();
    eventData.append("owner", formData.owner);
    eventData.append("title", formData.title);
    eventData.append("optional", formData.optional);
    eventData.append("description", formData.description);
    eventData.append("organizedBy", formData.organizedBy);
    eventData.append("eventDate", formData.eventDate);
    eventData.append("eventTime", formData.eventTime);
    eventData.append("location", formData.location);
    eventData.append("ticketPrice", formData.ticketPrice);
    eventData.append("image", formData.image);
    eventData.append("likes", 0);

    axios
      .post("/createEvent", eventData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Event posted successfully:", response.data);
        alert("Event Created Successfully");
        navigate("/");
        setFormData({
          owner: user ? user.name : "",
          title: "",
          optional: "",
          description: "",
          organizedBy: "",
          eventDate: "",
          eventTime: "",
          location: "",
          ticketPrice: "",
          image: null,
          likes: '',
        });
      })
      .catch((error) => {
        console.error("Error posting event:", error);
        alert("Failed to create event. Please try again.");
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <div className="flex flex-col ml-20 mt-10">
      <h1 className="font-bold text-[36px] mb-5">Post an Event</h1>

      <form onSubmit={handleSubmit} className="flex flex-co">
        <div className="flex flex-col gap-5">
          {/* Title */}
          <label className="flex flex-col">
            Title:
            <input
              type="text"
              name="title"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="text-red-500">{errors.title}</span>}
          </label>

          {/* Optional */}
          <label className="flex flex-col">
            Optional:
            <input
              type="text"
              name="optional"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.optional}
              onChange={handleChange}
            />
          </label>

          {/* Description */}
          <label className="flex flex-col">
            Description:
            <textarea
              name="description"
              className="rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 h-8 border-none"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="text-red-500">{errors.description}</span>}
          </label>

          {/* Organized By */}
          <label className="flex flex-col">
            Organized By:
            <input
              type="text"
              name="organizedBy"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.organizedBy}
              onChange={handleChange}
            />
            {errors.organizedBy && <span className="text-red-500">{errors.organizedBy}</span>}
          </label>

          {/* Event Date */}
          <label className="flex flex-col">
            Event Date:
            <input
              type="date"
              name="eventDate"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.eventDate}
              onChange={handleChange}
            />
            {errors.eventDate && <span className="text-red-500">{errors.eventDate}</span>}
          </label>

          {/* Event Time */}
          <label className="flex flex-col">
            Event Time:
            <input
              type="time"
              name="eventTime"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.eventTime}
              onChange={handleChange}
            />
            {errors.eventTime && <span className="text-red-500">{errors.eventTime}</span>}
          </label>

          {/* Location */}
          <label className="flex flex-col">
            Location:
            <input
              type="text"
              name="location"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <span className="text-red-500">{errors.location}</span>}
          </label>

          {/* Ticket Price */}
          <label className="flex flex-col">
            Ticket Price:
            <input
              type="number"
              name="ticketPrice"
              className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              value={formData.ticketPrice}
              onChange={handleChange}
            />
            {errors.ticketPrice && <span className="text-red-500">{errors.ticketPrice}</span>}
          </label>

          {/* Image */}
          <label className="flex flex-col">
            Image:
            <input
              type="file"
              name="image"
              className="rounded mt-2 pl-5 px-4 py-10 ring-sky-700 ring-2 h-8 border-none"
              onChange={handleImageUpload}
            />
            {errors.image && <span className="text-red-500">{errors.image}</span>}
          </label>

          {/* Submit Button */}
          <button
            className="primary"
            type="submit"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Submitting..." : "Submit"} {/* Show loading text when submitting */}
          </button>
        </div>
      </form>
    </div>
  );
}