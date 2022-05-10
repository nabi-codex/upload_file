<template>
  <div class="parent">
    <VueFileAgent
      ref="vueFileAgent"
      :theme="'grid'"
      :multiple="true"
      :deletable="true"
      :meta="true"
      :accept="'image/*'"
      :maxSize="'10MB'"
      :maxFiles="8"
      :helpText="'Choose images or zip files'"
      :errorText="{
      type: 'Invalid file type. Only images or zip Allowed',
      size: 'Files should not exceed 10MB in size',
    }"
      @select="filesSelected($event)"
      @beforedelete="onBeforeDelete($event)"
      @delete="fileDeleted($event)"
      v-model="fileRecords"
    ></VueFileAgent>
    <button :disabled="!fileRecordsForUpload.length" @click="uploadFiles()">
      Upload {{ fileRecordsForUpload.length }} files
    </button>

  </div>
</template>


<script>
import axios from "axios";

export default {
  name: 'IndexPage',
  data: function () {
    return {
      fileRecords: [],
      uploadUrl: 'http://localhost:8086/api/v1/upload/single',
      uploadHeaders: {'X-Test-Header': 'vue-file-agent'},
      fileRecordsForUpload: [], // maintain an upload queue
    };
  },
  methods: {
    uploadFiles() {
      let formData = new FormData()
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
      this.fileRecords.forEach((file, index) => {
        console.log(JSON.stringify(file.file))
        formData.append("icon_img", file.file)
      })
      formData.append("key", 'value')
      const response = axios.post('http://localhost:8000/api/v1/common?table_name=Brand', formData, config)
      this.fileRecordsForUpload = [];
      console.log("response " + JSON.stringify(response))
    },

    deleteUploadedFile: function (fileRecord) {
      // Using the default uploader. You may use another uploader instead.
      this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
    },
    filesSelected: function (fileRecordsNewlySelected) {
      let validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
      this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
    },
    onBeforeDelete: function (fileRecord) {
      let i = this.fileRecordsForUpload.indexOf(fileRecord);
      if (i !== -1) {
        // queued file, not yet uploaded. Just remove from the arrays
        this.fileRecordsForUpload.splice(i, 1);
        let k = this.fileRecords.indexOf(fileRecord);
        if (k !== -1) this.fileRecords.splice(k, 1);
      } else {
        if (confirm('Are you sure you want to delete?')) {
          this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
        }
      }
    },

    fileDeleted: function (fileRecord) {
      let i = this.fileRecordsForUpload.indexOf(fileRecord);
      if (i !== -1) {
        this.fileRecordsForUpload.splice(i, 1);
      } else {
        this.deleteUploadedFile(fileRecord);
      }
    },
  },
};
</script>

