import React from 'react';
import {Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';

const ImageUtil = {

    saveImg: (img, callback) => {
        if (Platform.OS === 'ios') {
            let promise = CameraRoll.saveToCameraRoll(img, 'photo');
            promise.then(function (result) {
                callback('保存成功');
            }).catch(function (error) {
                callback('保存失败');
            });
        } else {
            const storeLocation = `${RNFS.DocumentDirectoryPath}`;
            let pathName = new Date().getTime() + Math.random(1000, 9999) + '.png';
            let downloadPath = `${storeLocation}/${pathName}`;
            const ret = RNFS.downloadFile({fromUrl: img, toFile: downloadPath});
            ret.promise.then(res => {
                if (res && res.statusCode === 200) {
                    var promise = CameraRoll.saveToCameraRoll('file://' + downloadPath);
                    promise.then(function (result) {
                        callback('保存成功');
                    }).catch(function (error) {
                        callback('保存失败');
                    });
                }
            });
        }

    },
    getMorePhotos: (Params, callback) => {
        const promise = CameraRoll.getPhotos(Params);
        promise.then(data => {
            const edges = data.edges;
            const photos = [];
            // console.log(data);

            for (let i in edges) {
                photos.push(edges[i].node.image);
            }
            callback(true, photos);
        }, function (err) {
            callback(false, []);
        });
    },

};

module.exports = ImageUtil;
