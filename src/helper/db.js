import SQLite from 'react-native-sqlite-storage';
import md5 from 'md5';
import {
    DEFAULT_USER_NAME,
    DEFAULT_USER_PASSWORD
} from '../config';
import { dateTime2Str } from './dateTime';

export const connectDB = (dbFileName) => {
    return SQLite.openDatabase(
        {
            name: dbFileName,
            location: "default"
        },
        () => { console.log("Database connected!") }, //on success
        error => console.log("Database error", error) //on error
    )
}

export const createUserTable = (db) => {
    let sql = `CREATE TABLE IF NOT EXISTS tbl_user (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "user" text(255),
      "password" text(255));
    `;
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                () => {
                    console.log("create user table successfully")
                    resolve(true);
                },
                (error) => {
                    console.log(error)
                    reject(false);
                }
            );
        });
    });
}

export const createSettingTable = (db) => {
    let sql = `
      CREATE TABLE IF NOT EXISTS tbl_setting (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "price" integer(11),
          "profit" integer(11),
          "isFinished" integer(11),
          "endDate" text(255),
          "createAt" text(255));
      `;
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                () => {
                    console.log("create setting table successfully")
                    resolve(true);
                },
                (error) => {
                    console.log(error)
                    reject(false);
                }
            );
        });
    });
}

export const createSquareTable = (db) => {
    let sql = `
        CREATE TABLE "tbl_square" (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "name" text(255),
            "phoneNumber" text(255),
            "settingId" INTEGER(11),
            CONSTRAINT "settingId" FOREIGN KEY ("settingId") REFERENCES "tbl_setting" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );
      `;
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                () => {
                    console.log("create square table successfully")
                    resolve(true);
                },
                (error) => {
                    console.log(error)
                    reject(false);
                }
            );
        });
    });
}

export const checkDBExist = (db) => {
    let sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_square';";
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    resolve(resultSet.rows.length);
                },
                (error) => {
                    console.log("Error in checkDBExist");
                    reject(error);
                }
            );
        });
    });
}

export const getUsers = (db) => {
    let sql = "select * from tbl_user";
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let result = [];
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    resolve(resultSet.rows.item(0));
                },
                (error) => {
                    reject(error);
                }
            )
        })
    })
}

export const readLastSetting = (db) => {
    let sql = `
        SELECT A.*, COUNT(B.id) as squares
            FROM tbl_setting A
            LEFT JOIN tbl_square B
                on A.id = B.settingId
            GROUP BY A.id
            ORDER BY A.id
            DESC LIMIT 1
    `;
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    resolve({ status: true, data: resultSet.rows.item(0) });
                },
                (error) => {
                    console.log("error on Insert Setting ", error);
                    reject({ status: false, error });
                }
            );
        });
    });
}

export const readAllSetting = (db) => {
    let sql = `
        SELECT A.*, COUNT(B.id) as squares
            FROM tbl_setting A
            LEFT JOIN tbl_square B
                on A.id = B.settingId
            GROUP BY A.id
            ORDER BY A.id DESC
    `;
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let result = [];
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        result.push(resultSet.rows.item(i))
                    }
                    resolve(result);
                },
                (error) => {
                    console.log("error on Read All Setting ", error);
                    reject(error);
                }
            )
        })
    });
}

export const readLastSquare = (db) => {
    let sql = "SELECT * FROM tbl_square ORDER BY id DESC LIMIT 1";
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    resolve({ status: true, data: resultSet.rows.item(0) });
                },
                (error) => {
                    console.log("error on Read Last Square ", error);
                    reject({ status: false, error });
                }
            )
        })
    });
}

export const readSquareOfSetting = (data, db) => {
    let sql = "SELECT * FROM tbl_square WHERE settingId =?";
    let params = [data.settingId];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let result = [];
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    for (let i = 0; i < resultSet.rows.length; i++)
                        result.push(resultSet.rows.item(i));
                    resolve(result);
                },
                (error) => {
                    console.log("error on Read Last Square ", error);
                    reject(error);
                }
            )
        })
    });
}

export const insertUserData = (db) => {
    let sql = "INSERT INTO tbl_user (user, password) VALUES (?, ?)";
    let params = [DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet.insertId);
                },
                (error) => {
                    console.log("Error in insert admin user data");
                    reject(error);
                }
            );
        });
    });
}

export const insertSetting = (db, data) => {
    let sql = "INSERT INTO tbl_setting (price, profit,isFinished, endDate, createAt ) VALUES (?, ?, ?, ?, ?)";
    let params = [data.price, data.profit, data.isFinished, data.endDate, data.createAt];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet.insertId);
                },
                (error) => {
                    console.log("Error on insert setting");
                    reject(error);
                }
            );
        });
    });
}

export const insertSquare = (data, db) => {
    let sql = "INSERT INTO tbl_square (name, phoneNumber, settingId ) VALUES (?, ?, ?)";
    let params = [data.name, data.phoneNumber, data.settingId];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet.insertId);
                },
                (error) => {
                    console.log("error on Insert Square ");
                    reject(error);
                }
            );
        });
    });
}

export const updatAuthInfo = (data, db) => {

}

export const updateSetting = (data, db) => {
    let sql = "UPDATE tbl_setting SET isFinished =  ? WHERE id = ?";
    let params = [data.isFinished, data.id];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet);
                },
                (error) => {
                    console.log("error on Update Setting ");
                    reject(error);
                }
            );
        });
    });

}


export const removeSetting = (db) => {

}

export const removeSquare = (db) => {

}

export const removeAllSetting = (db) => {

}

export const AuthLogin = (db) => {

}

export const dropUserTable = (db) => {
    let sql = `
        DROP TABLE tbl_setting;
    `
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    console.log("success in drop table")
                    resolve(resultSet);
                },
                (error) => {
                    console.log("error ", error)
                    reject(error);
                }
            );
        });
    });
}

export const dropSettingTable = (db) => {
    let sql = `
    DROP TABLE tbl_setting;
    `
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    console.log("success in drop table")
                    resolve(resultSet);
                },
                (error) => {
                    console.log("error ", error)
                    reject(error);
                }
            );
        });
    });
}

export const dropSquareTable = (db) => {
    let sql = `
    DROP TABLE tbl_square;
    `
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    console.log("success in drop table")
                    resolve(resultSet);
                },
                (error) => {
                    console.log("error ", error)
                    reject(error);
                }
            );
        });
    });
}
