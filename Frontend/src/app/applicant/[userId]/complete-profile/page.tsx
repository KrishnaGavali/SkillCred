"use client";

import { CircleCheck, Github, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ProfileFormPage = () => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (profilePic) {
      formData.append("profile_picture", profilePic);
    }

    // You can POST this to your backend now
    const response = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Server response:", result);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background border-x border-border-color text-foreground">
      <h1 className="text-4xl md:text-5xl font-extrabold text-primary px-6 py-6 max-w-5xl w-full mx-auto text-left">
        Complete your profile
      </h1>

      <div className="border-y border-border-color py-6 px-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full"
        >
          {/* First Name */}
          <div className="flex flex-col">
            <label htmlFor="firstName" className="mb-1 font-medium">
              First Name
            </label>
            <input
              name="first_name"
              id="firstName"
              type="text"
              className="px-4 py-2 border border-border-color rounded-md"
              placeholder="e.g. Krishna"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label htmlFor="lastName" className="mb-1 font-medium">
              Last Name
            </label>
            <input
              name="last_name"
              id="lastName"
              type="text"
              className="px-4 py-2 border border-border-color rounded-md"
              placeholder="e.g. Sharma"
              required
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="bio" className="mb-1 font-medium">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              className="px-4 py-2 border border-border-color rounded-md resize-none"
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-medium">Profile Picture</label>
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                className="w-28 h-28 rounded-md object-cover mb-3 border"
                width={96}
                height={96}
              />
            )}
            <div className="flex items-center gap-2">
              <label
                htmlFor="uploadImg"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Upload /> <span>Upload File:</span>
              </label>
              <input
                id="uploadImg"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="px-3 py-2 border rounded-md w-20"
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="flex flex-col">
            <label htmlFor="linkedin_url" className="mb-1 font-medium">
              LinkedIn URL
            </label>
            <input
              name="linkedin_url"
              id="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/yourhandle"
              className="px-4 py-2 border rounded-md"
            />
          </div>

          {/* College */}
          <div className="flex flex-col">
            <label htmlFor="college" className="mb-1 font-medium">
              College
            </label>
            <input
              name="college"
              id="college"
              type="text"
              placeholder="e.g. G. H. Raisoni COE"
              className="px-4 py-2 border rounded-md"
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label htmlFor="city" className="mb-1 font-medium">
              City
            </label>
            <input
              name="city"
              id="city"
              type="text"
              placeholder="e.g. Pune"
              className="px-4 py-2 border rounded-md"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="country" className="mb-1 font-medium">
              Country
            </label>
            <input
              name="country"
              id="country"
              type="text"
              placeholder="e.g. India"
              className="px-4 py-2 border rounded-md"
            />
          </div>

          {/* GitHub Button */}
          <button className="bg-background text-foreground flex items-center justify-between px-4 py-2 border rounded-md hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              <span>GitHub Connected</span>
            </div>
            <div
              className="h-full border-l pl-3 ml-3 flex items-center justify-center"
              id="isConnected"
            >
              <CircleCheck className="w-5 h-5 text-green-500" />
            </div>
          </button>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-foreground text-primary-foreground hover:bg-primary/75 transition font-semibold"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileFormPage;
