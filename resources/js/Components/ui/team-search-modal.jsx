import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import axios from "axios";

export default function SearchModal({ placeholder, onSubmit, buttonLabel }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setInputValue("");
  };

  const teamJoin = async (team_code) => {
    try {
      console.log(`Attempting to join team with ID: ${team_code}`);
      await axios.post(`/teams/join/${team_code}`);
      console.log(`Successfully joined team with ID: ${team_code}`);
      onSubmit();
    } catch (error) {
      console.error(`Failed to join team with ID: ${team_code}`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Form submitted with input value: ${inputValue}`);
    if (inputValue.trim()) {
      try {
        await teamJoin(inputValue); // Assure que l'appel à teamJoin est asynchrone
        setIsSearchVisible(false);
        setInputValue("");
        window.location.reload();
      } catch (error) {
        console.error("Failed to submit the form", error);
      }
    }
  };

  return (
    <>
      <Button
        onClick={toggleSearch}
        className="z-10 bg-zinc-700 hover:bg-zinc-600 text-white"
      >
        {buttonLabel}
      </Button>

      <AnimatePresence>
        {isSearchVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 z-20"
              onClick={toggleSearch}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="fixed z-30 w-full max-w-md px-4"
              style={{ left: "37vw" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-zinc-300 rounded-lg blur-md"></div>
                <form onSubmit={handleSubmit} className="relative overflow-hidden">
                  <Input
                    type="text"
                    placeholder={placeholder}
                    className="border-none bg-transparent text-white placeholder-zinc-400 focus:ring-0 py-6"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-zinc-700 hover:bg-zinc-600"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
