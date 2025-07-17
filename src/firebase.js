import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, push, remove, update } from "firebase/database";
import { getStorage } from "firebase/storage";
import * as XLSX from "xlsx";

const firebaseConfig = {
  apiKey: "AIzaSyDEmEKFnqoi1jJWxd2nqW1o2tSSe0AXQ8o",
  authDomain: "ai-based-career-guidance-pltf.firebaseapp.com",
  databaseURL: "https://ai-based-career-guidance-pltf-default-rtdb.firebaseio.com",
  projectId: "ai-based-career-guidance-pltf",
  storageBucket: "ai-based-career-guidance-pltf.appspot.com",
  messagingSenderId: "238568972260",
  appId: "1:238568972260:web:70d3fa5cba61ce567cf1f1",
  measurementId: "G-J4BRXZGJ11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Firebase CRUD operations
export const fetchData = (path, setState) => {
  const dataRef = ref(database, path);
  onValue(
    dataRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setState(Object.entries(data).map(([id, value]) => ({ id, ...value })));
      } else {
        setState([]);
      }
    },
    (error) => {
      console.error(`Error fetching ${path}:`, error);
    }
  );
};

export const addData = (path, data) => push(ref(database, path), data);
export const saveChanges = (path, id, data) => update(ref(database, `${path}/${id}`), data);
export const deleteData = (path, id) => remove(ref(database, `${path}/${id}`));

// 📂 Optimized Upload Excel Data Function
export const uploadExcelData = async (file, path, setState, setUploadProgress) => {
  if (!file) {
    alert("No file selected!");
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        alert("The uploaded file is empty!");
        return;
      }

      let uploadedCount = 0;
      const totalItems = jsonData.length;
      const uploadPromises = jsonData.map((item) =>
        push(ref(database, path), item).then(() => {
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalItems) * 100));
        })
      );

      await Promise.all(uploadPromises); // Ensure all uploads are complete

      fetchData(path, setState); // Refresh the UI with new data
      alert("Upload successful!");
    } catch (error) {
      console.error("Error processing Excel file:", error);
      alert("Failed to process the file. Please check the format and try again.");
    }
  };

  reader.readAsArrayBuffer(file);
};

// Export Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export { database };
export default app;
