"use client";

import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

export function AvatarUpload({ currentAvatar, onImageSelect, onRemove, isEditing }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarUrl = previewUrl || currentAvatar || "/placeholder.svg?height=200&width=200";

  return (
    <div className="relative">
      <div className="relative size-32 md:size-40">
        <motion.img
          src={avatarUrl}
          alt="Profile picture"
          className="rounded-full object-cover border-4 border-background shadow-xl"
          style={{ width: "100%", height: "100%" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        {isEditing && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-all duration-300"
            >
              <input ref={inputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:text-white hover:bg-black/20"
                onClick={() => inputRef.current?.click()}
              >
                <Camera className="size-5" />
              </Button>
              {(previewUrl || currentAvatar) && onRemove && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-black/20 ml-2"
                  onClick={onRemove}
                >
                  <X className="size-5" />
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

AvatarUpload.propTypes = {
  currentAvatar: PropTypes.string,
  onImageSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  isEditing: PropTypes.bool.isRequired,
};
