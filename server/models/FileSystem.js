const mongoose = require('mongoose');

class FileSystemModel {
  constructor() {
    mongoose.connection.on('connected', () => {
      this.bucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        {
          bucketName: 'filesystem',
          chunkSizeBytes: 4 * 1024 * 1024,
        },
      );
      this.files = mongoose.connection.db.collection('filesystem.files');
      this.chunks = mongoose.connection.db.collection('filesystem.chunks');
    });
  }

  /** **USE WITH CAUTION:** Clear all files */
  async clear() {
    await this.files.deleteMany({});
    await this.chunks.deleteMany({});
  }

  /** Create a new file */
  async uploadFile(filename, contentType, buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(filename, { contentType });
      uploadStream.once('error', async (err) => {
        reject(err);
      });
      uploadStream.once('finish', () => {
        this.files.findOne({ _id: uploadStream.id }).then((metadata) => resolve(metadata));
      });
      uploadStream.end(buffer);
    });
  }

  /** Read a file's metadata by id */
  async getFileById(id) {
    return this.files.findOne({ _id: mongoose.Types.ObjectId(id) });
  }

  /** Read a file's content by id */
  async downloadFileById(id, options) {
    return new Promise((resolve, reject) => {
      const downloadStream = options
        ? this.bucket.openDownloadStream(mongoose.Types.ObjectId(id), options)
        : this.bucket.openDownloadStream(mongoose.Types.ObjectId(id));
      downloadStream.once('error', (err) => {
        reject(err);
      });
      downloadStream.once('readable', () => {
        // pipe to response
        resolve(downloadStream);
      });
    });
  }

  /** Update a file by id */
  async updateFileById(id, filename, contentType, buffer) {
    try {
      await this.deleteFileById(id);
    } catch (err) {
      // do nothing
    }
    return this.uploadFile(filename, contentType, buffer);
  }

  /** Delete a file by id */
  async deleteFileById(id) {
    await this.bucket.delete(mongoose.Types.ObjectId(id));
  }
}

const FileSystem = new FileSystemModel();

module.exports = FileSystem;
