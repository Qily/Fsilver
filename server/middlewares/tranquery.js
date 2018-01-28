let tranquery2p = function (pool, queryStr1, queryStr2) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                connection.query(queryStr1, (err, rows1) => {
                    if (err) {
                        connection.rollback(function () {
                            reject(err);
                        })
                    }
                    connection.query(queryStr2, 94, (err, rows2) => {
                        if (err) {
                            connection.rollback(function () {
                                reject(err);
                            })
                        }
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                })
                            }
                        })
                        resolve(rows2);
                    })
                })

            })
            connection.release()
        })
    })
}

let tranquery3p = function (pool, queryStr1, queryStr2, queryStr3) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                connection.query(queryStr1, (err, rows1) => {
                    if (err) {
                        connection.rollback(function () {
                            reject(err);
                        })
                    }

                    connection.query(queryStr2, (err, row2) => {
                        if (err) {
                            connection.rollback(function () {
                                reject(err);
                            })
                        }

                        connection.query(queryStr3, (err, result) => {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                })
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        reject(err);
                                    })
                                }
                            })
                            resolve(result);
                        })
                    })
                })
            })
            connection.release()
        })
    })
}

let tranquery4p = function (pool, queryStr1, queryStr2, queryStr3, queryStr4) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                connection.query(queryStr1, (err, rows1) => {
                    if (err) {
                        connection.rollback(function () {
                            reject(err);
                        })
                    }

                    connection.query(queryStr2, (err, row2) => {
                        if (err) {
                            connection.rollback(function () {
                                reject(err);
                            })
                        }

                        connection.query(queryStr3, (err, row3) => {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                })
                            }

                            connection.query(queryStr4, (err, result) => {
                                if (err) {
                                    connection.rollback(function () {
                                        reject(err);
                                    })
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            reject(err);
                                        })
                                    }
                                })
                                resolve(result);
                            })
                        })
                    })

                })

            })
            connection.release()
        })
    })
}



let tranquery5p = function (pool, queryStr1, queryStr2, queryStr3, queryStr4, queryStr5) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                //执行第一次query
                connection.query(queryStr1, (err, rows1) => {
                    if (err) {
                        connection.rollback(function () {
                            reject(err);
                        })
                    }
                    //执行第二次query
                    connection.query(queryStr2, (err, row2) => {
                        if (err) {
                            connection.rollback(function () {
                                reject(err);
                            })
                        }
                        //执行第三次query
                        connection.query(queryStr3, (err, row3) => {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                })
                            }
                            //执行第四次query
                            connection.query(queryStr4, (err, row4) => {
                                if (err) {
                                    connection.rollback(function () {
                                        reject(err);
                                    })
                                }
                                //执行第五次query
                                connection.query(queryStr5, (err, result) => {
                                    if (err) {
                                        connection.rollback(function () {
                                            reject(err);
                                        })
                                    }

                                    connection.commit(function (err) {
                                        if (err) {
                                            connection.rollback(function () {
                                                reject(err);
                                            })
                                        }
                                    })
                                    resolve(result);
                                })
                            })
                        })
                    })
                })
            })
            connection.release()
        })
    })
}



module.exports = {
    tranquery2p: tranquery2p,
    tranquery3p: tranquery3p,
    tranquery4p: tranquery4p,
    tranquery5p: tranquery5p,
}