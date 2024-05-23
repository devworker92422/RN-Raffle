/*
 Navicat Premium Data Transfer

 Source Server         : Sqlite
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 22/05/2024 02:00:08
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for tbl_square
-- ----------------------------
DROP TABLE IF EXISTS "tbl_square";
CREATE TABLE "tbl_square" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" text(255),
  "phoneNumber" text(255),
  "settingId" INTEGER,
  CONSTRAINT "settingId" FOREIGN KEY ("settingId") REFERENCES "tbl_setting" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- ----------------------------
-- Auto increment value for tbl_square
-- ----------------------------

PRAGMA foreign_keys = true;
