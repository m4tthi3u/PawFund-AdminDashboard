import React from "react";
import { motion } from "framer-motion";
import { FaPaw, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { SiSquareenix } from "react-icons/si";
import { BiCopyright } from "react-icons/bi";

const CopyrightPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/m4tthi3u", label: "GitHub" },
    {
      icon: SiSquareenix,
      href: "https://eu.finalfantasyxiv.com/lodestone/character/52918598/",
      label: "FFXIV Profile",
    },
    { icon: FaEnvelope, href: "mailto:matthew@dekomori.ch", label: "Email" },
  ];

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
        <motion.div
          className="flex items-center justify-center mb-12"
          variants={item}
        >
          <div className="relative">
            <FaPaw className="w-16 h-16 text-blue-600" />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 ml-6 gradient-text">
            PawFund Copyright Notice
          </h1>
        </motion.div>

        <motion.div variants={item} className="space-y-8 text-gray-600">
          <div className="flex items-center space-x-2 text-lg">
            <BiCopyright className="w-5 h-5" />
            <p>
              {new Date().getFullYear()} PawFund Admin Dashboard. All rights
              reserved.
            </p>
          </div>

          <motion.div
            className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              Developer Information
            </h3>
            <p className="mb-4">Crafted with ❤️ by Matthew (Lâm Nguyễn)</p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              License
            </h2>
            <div className="prose prose-blue">
              <p className="leading-relaxed">
                This project is licensed under the MIT License. Permission is
                hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files, to deal in
                the Software without restriction.
              </p>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Terms of Use
            </h2>
            <ul className="grid gap-4">
              {[
                "Content may not be used for commercial purposes without explicit permission",
                "Attribution must be given when sharing or redistributing",
                "Modifications must be indicated",
                "A copy of the license must be included with the software",
              ].map((term, index) => (
                <motion.li
                  key={index}
                  className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg"
                  whileHover={{ x: 10 }}
                >
                  <span className="h-2 w-2 bg-blue-600 rounded-full" />
                  <span>{term}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CopyrightPage;
