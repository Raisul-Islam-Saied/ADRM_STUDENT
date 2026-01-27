import {
  AlertCircle,
  ArrowRight,
  Camera, Check,
  ChevronLeft,
  CreditCard,
  Edit3,
  FileText,
  Home,
  IdCard,
  Layers,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// FIREBASE IMPORTS
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

// ==============================================
// 1. FIREBASE & APP CONFIGURATION
// ==============================================

const firebaseConfig = {
  apiKey: "AIzaSyCrmkkxixxtiLON5JGqSU3Rsx5WVgQaUDw",
  authDomain: "central-pod-376117.firebaseapp.com",
  projectId: "central-pod-376117",
  storageBucket: "central-pod-376117.firebasestorage.app",
  messagingSenderId: "1003594162237",
  appId: "1:1003594162237:web:c7b377ab71e90c102d0a54",
  measurementId: "G-QETBDY6355"
};
const CLASS_ORDER = {
  'প্লে': 1, 'নার্সারি': 2, 'কেজি': 3,
  '১ম': 4, '২য়': 5, '৩য়': 6, '৪র্থ': 7, '৫ম': 8,
  '৬ষ্ঠ': 9, '৭ম': 10, '৮ম': 11, '৯ম': 12, '১০ম': 13
};
// Initialize Firebase
const  app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbwJdYyKraaP194D-byPE8zZnCtIRyRgJRIN-AoH4CT5N7joPY_D63ZgfgwpdzJbEea0kA/exec",
  CLOUD_NAME: "djjnoclzp", 
  UPLOAD_PRESET: "student_db", 
  APP_NAME: "Abdur Razzaq Dakhil Madrasah "
};

// ROLE MAPPING (Email to Role)
const USER_ROLES = {
  "admin@adrm.com":   { role: "Admin" },
  "play@adrm.com":  { role: "Class", classBn: "প্লে" },
  "nursery@adrm.com":  { role: "Class", classBn: "নার্সারি" },
  "kg@adrm.com":  { role: "Class", classBn: "কেজি" },
  "class1@adrm.com":  { role: "Class", classBn: "১ম" },
  "class2@adrm.com":  { role: "Class", classBn: "২য়" },
  "class3@adrm.com":  { role: "Class", classBn: "৩য়" },
  "class4@adrm.com":  { role: "Class", classBn: "৪র্থ" },
  "class5@adrm.com":  { role: "Class", classBn: "৫ম" },
  "class6@adrm.com":  { role: "Class", classBn: "৬ষ্ঠ" },
  "class7@adrm.com":  { role: "Class", classBn: "৭ম" },
  "class8@adrm.com":  { role: "Class", classBn: "৮ম" },
  "class9@adrm.com":  { role: "Class", classBn: "৯ম" },
  "class10@adrm.com": { role: "Class", classBn: "১০ম" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const REGEX = {
  BANGLA: /^[\u0980-\u09FF\s.]+$/,
  ENGLISH: /^[a-zA-Z\s.]+$/,
  MOBILE: /^01[3-9]\d{8}$/,
  NUMBER: /^\d+$/
};

// ==============================================
// 3. UI COMPONENTS
// ==============================================

const Header = ({ title, action }) => (
  <div className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-5 shadow-sm">
    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
    {action}
  </div>
);

const NavTab = ({ icon: Icon, label, active, onClick, main }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-1/4 transition-all duration-300 ${main ? '-mt-10' : ''}`}
  >
    <div className={`flex items-center justify-center transition-all duration-300 ${
      main 
        ? 'w-16 h-16 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-300 ring-4 ring-white transform active:scale-95' 
        : active ? 'text-blue-600' : 'text-gray-400'
    }`}>
      <Icon size={main ? 32 : 24} strokeWidth={active || main ? 2.5 : 2} />
    </div>
    {!main && <span className={`text-[10px] font-bold mt-1.5 ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>}
  </button>
);

const StudentRow = ({ data, onClick }) => (
  <div
    onClick={() => onClick(data)}
    className="bg-white p-4 rounded-2xl mb-3 flex items-center gap-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-50 active:scale-[0.98] transition-transform relative overflow-hidden cursor-pointer"
  >
    <div
      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        data.Status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
      }`}
    ></div>

    <img
      src={data.ImageURL || 'https://via.placeholder.com/100'}
      className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 bg-gray-50"
      alt=""
    />

    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-bold text-slate-800 text-base truncate min-w-0">
          {data.StudentNameBn}
        </h3>
        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0">
          Roll {data.Roll}
        </span>
      </div>

      <div className="flex justify-between mt-1">
        <p className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded font-mono truncate">
          ID: {data.ID}
        </p>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
          Class {data.ClassBn}
        </span>
      </div>
    </div>

    <ChevronLeft size={18} className="text-gray-300 rotate-180 shrink-0" />
  </div>
);

// ==============================================
// 4. MAIN APP LOGIC
// ==============================================
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [tab, setTab] = useState('home');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState('');
// ... অন্যান্য useState এর নিচে ...
const [scrollPos, setScrollPos] = useState(0);
const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });


const [sortConfig, setSortConfig] = useState(() => {
  return JSON.parse(localStorage.getItem("sortConfig")) || { field: '', order: '' };
});

const [adminClassFilter, setAdminClassFilter] = useState(() => {
  return localStorage.getItem("adminClassFilter") || 'All';
});

const showToast = (msg, type = 'success') => {
  setToast({ show: true, msg, type });
  // ৩ সেকেন্ড পর অটোমেটিক বন্ধ হবে
  setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
};


useEffect(() => {
  localStorage.setItem("sortConfig", JSON.stringify(sortConfig));
}, [sortConfig]);

useEffect(() => {
  localStorage.setItem("adminClassFilter", adminClassFilter);
}, [adminClassFilter]);

  // 1. FIREBASE AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const roleData = USER_ROLES[user.email];
        if (roleData) {
          setCurrentUser({ ...user, ...roleData });
        } else {
          alert("এই ইমেইলের কোনো এক্সেস নেই। এডমিনের সাথে যোগাযোগ করুন।");
          signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. LOAD DATA ON LOGIN
  useEffect(() => { 
    if(currentUser) loadData(); 
  }, [currentUser]);
useEffect(() => {
  if (!detailData) {
    window.scrollTo({
      top: scrollPos,
      behavior: "instant" // চাইলে "smooth"
    });
  }
}, [detailData]);
  const roleFilteredStudents = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "Admin") return students;
    if (currentUser.role === "Class") return students.filter(s => s.ClassBn === currentUser.classBn);
    return [];
  }, [students, currentUser]);
useEffect(() => {
  const handleBack = (e) => {
    e.preventDefault();

    if (detailData) {
      setDetailData(null);     // Detail থেকে Home
    } else if (tab !== 'home') {
      setTab('home');         // অন্য ট্যাব থেকে Home
    } else {
      // Home এ থাকলে সত্যিই বের হবে
      if (window.confirm("আপনি কি অ্যাপ থেকে বের হতে চান?")) {
        window.history.back();
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    }
  };

  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, [tab, detailData]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}?action=read&t=${Date.now()}`);
      const json = await res.json();
      if (json.status === 'success') setStudents(json.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    if(window.confirm("আপনি কি লগআউট করতে চান?")) {
      signOut(auth);
    }
  };

  const handleSave = async (formData) => {
    const exists = students.find(s =>
  s.ClassBn === formData.classBn &&
  String(s.Roll) === String(formData.roll) &&
  s.ID !== (isEdit ? detailData.ID : null)
);

if (exists) {
  showToast("এই ক্লাসে এই রোল নম্বর আগে থেকেই আছে!", "error");
  return;
}
    // DUPLICATE ROLL CHECK
if (!isEdit) {
  const exists = students.find(s =>
    s.ClassBn === formData.classBn &&
    String(s.Roll) === String(formData.roll)
  );

  if (exists) {
    showToast("এই ক্লাসে এই রোল নম্বর আগে থেকেই আছে!", "error");
    return;
  }
}

    if (currentUser.role === "Class" && formData.classBn !== currentUser.classBn) {
      alert("আপনি শুধু নিজের ক্লাসে ডাটা দিতে পারবেন");
      return;
    }
    setProcessing(true);
    try {
      let imgUrl = formData.imageUrl;
      if (imgUrl && imgUrl.startsWith('data:')) {
        const cloudData = new FormData();
        cloudData.append('file', imgUrl);
        cloudData.append('upload_preset', CONFIG.UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUD_NAME}/image/upload`, { method: 'POST', body: cloudData });
        const json = await res.json();
        imgUrl = json.secure_url;
      }

      const payload = {
        action: isEdit ? 'update' : 'create',
        id: isEdit ? detailData.ID : null, 
        ...formData,
        imageUrl: imgUrl
      };

      await fetch(CONFIG.API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      await new Promise(r => setTimeout(r, 2000));
      await loadData();
      
      setTab('home');
      setDetailData(null);
      setIsEdit(false);
      // আগের কোড: alert(isEdit ? "আপডেট সফল হয়েছে!" : "ভর্তি সফল হয়েছে!");

// নতুন কোড:
showToast(isEdit ? "আপডেট সফল হয়েছে!" : "ভর্তি সফল হয়েছে!", "success");
    } catch (error) {
      // আগের কোড: alert("সমস্যা হয়েছে: " + error.message);

// নতুন কোড:
showToast("সমস্যা হয়েছে: " + error.message, "error");

    }
    setProcessing(false);
  };

  const handleDelete = async (id) => {

  if (!window.confirm("আপনি কি নিশ্চিত এই ডাটা ডিলিট করতে চান?")) return;

  if (currentUser.role === "Class" && detailData.ClassBn !== currentUser.classBn) {
    alert("আপনি এই ক্লাসের ডাটা ডিলিট করতে পারবেন না");
    return;
  }

  setProcessing(true);
  setStudents(prev => prev.filter(s => s.ID !== id));
  setDetailData(null);

  try {
    await fetch(CONFIG.API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'delete', id })
    });
    setTimeout(loadData, 2000);
  } catch {
    alert("নেটওয়ার্ক সমস্যা");
    loadData();
  }

  setProcessing(false);
};


  // --- EXPORT FUNCTIONS (FULL RESTORED) ---
const getFilteredData = () => {
  return filteredList;
};


  const handleExportTablePDF = () => {
    const data = getFilteredData();
    if (!data || data.length === 0) {
      showToast("লিস্ট প্রিন্ট করার জন্য কোনো ডাটা নেই", "error");
      return;
    }

    const w = window.open('', '_blank');
    w.document.write(`
    <html>
    <head>
      <title>${CONFIG.APP_NAME} - Register</title>
      <style>
        @media print { @page { size: A4; margin: 8mm; } }
        body { font-family: sans-serif; font-size: 15px; }
        h2 { text-align:center; margin-bottom:8px; }
        table { width:100%; font-size: 15px; border-collapse: collapse; table-layout: fixed; }
        th, td { border:1px solid #000; padding:5px; vertical-align: top; }
        th { background:#eee; text-align:center; }
        thead { display: table-header-group; }

        .col-small { width: 12%; text-align:center; }
        .col-name { width: 26%; }
        .col-family { width: 26%; }
        .col-address { width: 24%; }
        img { width: 100%; height: 100%; object-fit: contain; object-position: center center; }
        .block div { margin:2px 0; }
        .label { font-weight:bold; }

      </style>
    </head>
 <body>
  <h2>${CONFIG.APP_NAME} - Student Register</h2>
  <p style="text-align:center; font-size:13px; font-weight:bold; margin:4px 0;">
  Total: ${data.length} | 
  Male: ${data.filter(s => s.Gender === 'Male').length} | 
  Female: ${data.filter(s => s.Gender === 'Female').length}
</p>

<p style="text-align:center; font-size:12px; font-weight:bold; margin-bottom:8px;">
  ${[...new Set(data.map(s => s.ClassBn))].length === 1 
    ? `Class: ${data[0].ClassBn}` 
    : [...new Set(data.map(s => s.ClassBn))]
        .map(c => `${c}: ${data.filter(s => s.ClassBn === c).length}`)
        .join(' | ')
  }
</p>

  <table>
    <thead>
      <tr>
        <th class="col-small">Photo</th>
        <th class="col-name">Name Info</th>
        <th class="col-small">Class Info</th>
        <th class="col-family">Family & Phone</th>
        <th class="col-address">Address</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(s => `
        <tr>
          <td class="col-small">
            <img src="${s.ImageURL || ''}" />
          </td>
          <td class="col-name block">
            <div><span class="label"> ${s.StudentNameBn || ''}</span></div>
            <div><span class="label"> ${s.StudentNameEn || ''}</span></div>
            <div><span class="label"> ${s.ID || ''}</span></div>
          </td>
          <td class="col-small block">
            <div><span class="label">Class:</span> ${s.ClassEn || s.ClassBn || ''}</div>
            <div><span class="label">Roll:</span> ${s.Roll || ''}</div>
            <div><span class="label">Blood:</span> ${s.BloodGroup || ''}</div>
            <div><span class="label"> ${s.Gender || ''}</span></div>
          </td>
          <td class="col-family block">
            <div><span class="label">পিতা:</span> ${s.FatherNameBn || ''}</div>
            <div><span class="label">মাতা:</span> ${s.MotherNameBn || ''}</div>
            <div><span class="label">Phone:</span> ${s.WhatsApp || ''}</div>
          </td>
          <td class="col-address block">
            <div>
              ${s.HouseNameBn || ''}, ${s.VillageBn || ''}, 
              ${s.UnionBn || ''}, ${s.UpazilaBn || ''}, 
              ${s.DistrictBn || ''}
            </div>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <script>window.print()</script>
</body>

    </html>
    `);
    w.document.close();
  };

  const handleExportExcel = () => {
    const dataToExport = getFilteredData();
    if (dataToExport.length === 0)  return showToast("এক্সেল ডাউনলোড করার জন্য কোনো ডাটা নেই!", "error");

    const headers = [
      "ID", "Time", "Session", "Name (Bn)", "Name (En)", "Roll", "Class (Bn)", "Class (En)", 
      "BRN", "DOB", "Blood", "Gender","Father (Bn)", "Father (En)", "Mother (Bn)", "Mother (En)", 
      "Mobile", "Emergency", "House (Bn)", "House (En)", "Village (Bn)", "Village (En)", 
      "Union (Bn)", "Union (En)", "Ward", "Upazila (Bn)", "Upazila (En)", 
      "District (Bn)", "District (En)", "Image URL", "Status"
    ];

    const rows = dataToExport.map(s => [
          s.ID, s.Time, s.Session, s.StudentNameBn, s.StudentNameEn, s.Roll, s.ClassBn, s.ClassEn,
          `'${s.BRN}`, s.DOB, s.BloodGroup, s.Gender,s.FatherNameBn, s.FatherNameEn, s.MotherNameBn, s.MotherNameEn,
          `'${s.WhatsApp}`, `'${s.EmergencyNo}`, s.HouseNameBn, s.HouseNameEn, s.VillageBn, s.VillageEn,
          s.UnionBn, s.UnionEn, s.WardNo, s.UpazilaBn, s.UpazilaEn, s.DistrictBn, s.DistrictEn,
          s.ImageURL, s.Status
        ].map(f => `"${f || ''}"`).join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `Student_Data_${new Date().toLocaleDateString()}.csv`;

    link.click();
  };

const handleExportPDF = () => {
  const dataToExport = getFilteredData();
  if (dataToExport.length === 0) return showToast("ইনফো শিটের জন্য কোনো ডাটা পাওয়া যায়নি!", "error");

  const printWindow = window.open('', '_blank', 'height=900,width=1100');
  if (!printWindow) {
    return alert("পপআপ ব্লক হয়েছে!");
  }

  printWindow.document.write(`
  <html>
  <head>
    <title>Student Information Sheet</title>
    <style>
      @media print {
        @page { size: A4; margin: 10mm; }
      }

      body {
        font-family: Arial, sans-serif;
        font-size: 11px;
        margin: 0;
      }

      .page {
        page-break-after: always;
      }

      .student-card {
        border: 2px solid #000;
        padding: 8px;
        margin-bottom: 38px;
        height: 48%;
        box-sizing: border-box;
      }

      .header {
        text-align: center;
        border-bottom: 2px solid #000;
        margin-bottom: 6px;
      }

      .header h2 {
        margin: 0;
        font-size: 20px;
      }

      .header p {
        margin: 0;
        font-size: 15px;
      }

      .top-row {
        display: flex;
        gap: 10px;
      }

      .photo-box {
        width: 110px;
        text-align: center;
      }

      .photo-box img {
        width: 100px;
        height: 110px;
        border: 1px solid #000;
      }

      table {
      font-size : 13px;
        width: 100%;
        border-collapse: collapse;
      }

      td {
        border: 1px solid #000;
        padding: 3px;
        vertical-align: top;
      }

      .label {
        width: 35%;
        font-weight: bold;
      }

      .footer {
        margin-top: 28px;
        display: flex;
        justify-content: space-between;
      }

      .sign {
        border-top: 1px solid #000;
        width: 150px;
        text-align: center;
        font-size: 10px;
      }
    </style>
  </head>
  <body>
  `);

  dataToExport.forEach((s, i) => {
    if (i % 2 === 0) printWindow.document.write(`<div class="page">`);

    printWindow.document.write(`
      <div class="student-card">
        <div class="header">
          <h2>${CONFIG.APP_NAME}</h2>
          <p>Student Information Form</p>
        </div>

        <div class="top-row">
          <div class="photo-box">
            <img src="${s.ImageURL || ''}">
            <div>Roll: ${s.Roll}</div>
            <div>Class: ${s.ClassEn || s.ClassBn}</div>
          </div>

          <table>
            <tr><td class="label">শিক্ষার্থীর নাম :</td><td>${s.StudentNameBn}</td></tr>
            <tr><td class="label">Student's Name :</td><td>${s.StudentNameEn}</td></tr>
             <tr><td class="label">Student ID :</td><td>${s.ID}</td></tr>
            <tr><td class="label">জন্ম নিবন্ধন নং :</td><td>${s.BRN}</td></tr>
            <tr><td class="label">Date of Birth :</td><td>${formatDate(s.DOB)}</td></tr>
            <tr><td class="label">Blood Group :</td><td>${s.BloodGroup}</td></tr>
              <tr><td class="label">Gender :</td><td>${s.Gender}</td></tr>
            <tr><td class="label">Session :</td><td>${s.Session}</td></tr>

            <tr><td class="label">পিতার নাম :</td><td>${s.FatherNameBn}</td></tr>
            <tr><td class="label">Father's Name :</td><td>${s.FatherNameEn}</td></tr>
            <tr><td class="label">মাতার নাম :</td><td>${s.MotherNameBn}</td></tr>
            <tr><td class="label">Mother's Name :</td><td>${s.MotherNameEn}</td></tr>

            <tr><td class="label">মোবাইল :</td><td>${s.WhatsApp}</td></tr>
            <tr><td class="label">জরুরী নম্বর :</td><td>${s.EmergencyNo}</td></tr>

            <tr><td class="label">ঠিকানা (বাংলা) :</td>
              <td>${s.HouseNameBn || ''}, ${s.VillageBn || ''}, ${s.UnionBn || ''}, ${s.UpazilaBn || ''}, ${s.DistrictBn || ''}</td>
            </tr>

            <tr><td class="label">Address (English) :</td>
              <td>${s.HouseNameEn || ''}, ${s.VillageEn || ''}, ${s.UnionEn || ''}, ${s.UpazilaEn || ''}, ${s.DistrictEn || ''}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <div class="sign">Guardian's Signature</div>
          <div class="sign">Head Teacher</div>
        </div>
      </div>
    `);

    if (i % 2 === 1 || i === dataToExport.length - 1)
      printWindow.document.write(`</div>`);
  });

  printWindow.document.write(`
    <script>
      window.onload = function() {
        window.print();
      }
    <\/script>
  </body></html>
  `);

  printWindow.document.close();
};


const handleExportAllIDCards = () => {
  const list = getFilteredData();
  if (list.length === 0) return showToast("আইডি কার্ডের জন্য কোনো ডাটা নেই", "error");

  const w = window.open('', '_blank');

  w.document.write(`
  <html>
  <head>
    <title>All ID Cards</title>
    <style>
      @media print {
        @page { size: A4; margin: 10mm; }
      }

      body {
        margin: 0;
        font-family: Arial;
      }

      .page {
        width: 210mm;
        height: 297mm;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 8px;
        justify-items: center;
        align-items: center;
        page-break-after: always;
      }

      .id-card {
        width: 2.125in;
        height: 3.37in;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid #1e3a8a;
        text-align: center;
        position: relative;
      }

      .header {
        background: #1e3a8a;
        color: white;
        padding: 8px 0;
      }

      .header h2 { margin: 0; font-size: 12px; }
      .header p { margin: 0; font-size: 9px; opacity: 0.8; }

      .photo {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        border: 2px solid #1e3a8a;
        object-fit: cover;
        margin-top: 7px;
      }

      .name-section { margin-top: 5px; }
      .name-en { font-size: 12px; font-weight: bold; }
      .name-bn { font-size: 10px; color: #555; }
      .student-id { 
        display: inline-block; 
        background: #1e3a8a; 
        color: white; 
        padding: 2px 8px; 
        border-radius: 12px; 
        font-size: 8px; 
        margin-top: 4px;
      }

      .details-grid {
        margin-top: 7px;
        padding: 0 10px;
        text-align: left;
        font-size: 9px;
      }

      .address { font-size: 8px; }

      .row { 
        display: flex; 
        justify-content: space-between; 
        border-bottom: 1px solid #eee; 
        padding: 2px 0; 
      }

      .label { font-weight: bold; color: #555; }
      .value { font-weight: bold; color: #222; }

      .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: #1e3a8a;
        height: 6px;
      }

      .principal {
        position: absolute;
        bottom: 7px;
        right: 20px;
        text-align: center;
        width: 80px;
        border-top: 1px solid #333;
        font-size: 5px;
      }
    </style>
  </head>
  <body>
  `);

  list.forEach((data, i) => {

    // প্রতি ৯টা পর নতুন পেজ
    if (i % 9 === 0) {
      if (i !== 0) w.document.write(`</div>`);
      w.document.write(`<div class="page">`);
    }

    w.document.write(`
      <div class="id-card">
        <div class="header">
          <h2>${CONFIG.APP_NAME}</h2>
          <p>Rangunia, Chattogram</p>
        </div>

        <img src="${data.ImageURL}" class="photo" />

        <div class="name-section">
          <div class="name-en">${data.StudentNameEn}</div>
          <div class="name-bn">${data.StudentNameBn}</div>
          <div class="student-id">ID: ${data.ID}</div>
        </div>

        <div class="details-grid">
          <div class="row"><span class="label">Class/Roll</span><span class="value">${data.ClassEn}/${data.Roll}</span></div>
          <div class="row"><span class="label">Father</span><span class="value">${data.FatherNameBn}</span></div>
          <div class="row"><span class="label">Mother</span><span class="value">${data.MotherNameBn}</span></div> 
          <div class="row"><span class="label">DOB</span><span class="value">${formatDate(data.DOB)}</span></div>
          <div class="row"><span class="label">Blood</span><span class="value">${data.BloodGroup}</span></div>
          <div class="row"><span class="label">Mobile</span><span class="value">${data.WhatsApp}</span></div>
<div class="row "><span class="label">Address</span><span class="value address">${data.HouseNameBn}
</span></div>
<div class="row"><span class="label"></span><span class="value address">${data.VillageBn},
${data.UnionBn}, ${data.UpazilaBn},
${data.DistrictBn}</span></div>
          
        </div>

        <div class="principal">Principal</div>
        <div class="footer"></div>
      </div>
    `);
  });

  w.document.write(`
    </div>
    <script>window.print()</script>
  </body>
  </html>
  `);

  w.document.close();
};


 const filteredList = useMemo(() => {
  let list = roleFilteredStudents;
// SEARCH FILTER
if (searchText) {
  const lower = searchText.toLowerCase();
  list = list.filter(s =>
    (s.StudentNameBn && s.StudentNameBn.toLowerCase().includes(lower)) ||
    (s.StudentNameEn && s.StudentNameEn.toLowerCase().includes(lower)) ||
    (s.ID && s.ID.toString().includes(lower)) ||
    (s.Roll && s.Roll.toString().includes(lower)) ||
    (s.WhatsApp && s.WhatsApp.includes(lower))
  );
}

  // শুধু Admin এর জন্য Class filter
  if (currentUser?.role === "Admin" && adminClassFilter !== 'All') {

    list = list.filter(s => s.ClassBn === adminClassFilter);
  }

  const { field, order } = sortConfig;

  if (field === 'name') {
    list = [...list].sort((a, b) =>
      order === 'asc'
        ? a.StudentNameEn.localeCompare(b.StudentNameEn)
        : b.StudentNameEn.localeCompare(a.StudentNameEn)
    );
  }

  if (field === 'roll') {
    list = [...list].sort((a, b) =>
      order === 'asc' ? a.Roll - b.Roll : b.Roll - a.Roll
    );
  }

  if (field === 'class') {
    list = [...list].sort((a, b) =>
      order === 'asc'
        ? CLASS_ORDER[a.ClassBn] - CLASS_ORDER[b.ClassBn]
        : CLASS_ORDER[b.ClassBn] - CLASS_ORDER[a.ClassBn]
    );
  }

  if (field === 'time') {
    list = [...list].sort((a, b) =>
      order === 'asc'
        ? new Date(a.Time) - new Date(b.Time)
        : new Date(b.Time) - new Date(a.Time)
    );
  }

  return list;
}, [roleFilteredStudents, searchText, sortConfig, adminClassFilter, currentUser]);

  // --- AUTH CHECK LOADING ---
  if(authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // --- LOGIN PAGE ---
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-slate-800 pb-24">
      {processing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
          <p className="font-bold">কাজ চলছে...</p>
        </div>
      )}

      {/* --- HOME VIEW --- */}
      {tab === 'home' && !detailData && (
        <>
          <Header 
            title={CONFIG.APP_NAME} 
            action={
              <div className="flex gap-2">
                <button onClick={loadData} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
                  <RefreshCw size={20} className={`text-slate-600 ${loading ? 'animate-spin' : ''}`}/>
                </button>
                <button onClick={handleLogout} className="p-2 bg-red-50 rounded-full active:bg-red-100 text-red-600">
                  <LogOut size={20} />
                </button>
              </div>
            }
          />
          
          <div className="pt-20 px-5">
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-2xl shadow-slate-300 mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                {currentUser?.role === 'Admin' ? 'Admin Dashboard' : `Class ${currentUser?.classBn || ''} Dashboard`}

                </p>
                <h2 className="text-4xl font-black">{filteredList.length} <span className="text-lg font-medium text-slate-400">Students</span></h2>
                <div className="mt-2 flex gap-3 text-xs">
  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-bold">
    Male: {filteredList.filter(s => s.Gender === 'Male').length}
  </div>
  <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-lg font-bold">
    Female: {filteredList.filter(s => s.Gender === 'Female').length}
  </div>
</div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600 rounded-full blur-[50px] opacity-50"></div>
            </div>

            {/* --- EXPORT SECTION --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Download Data</h3>
             <div className="flex gap-7 justify-center">

             
            <button onClick={handleExportExcel} className="flex flex-col items-center gap-1">
  <div className="bg-green-100 p-3 rounded-xl text-green-700">
    <FileText size={22}/>
  </div>
  <span className="text-[10px] font-bold text-gray-500">Excel</span>
</button>

             <button onClick={handleExportPDF} className="flex flex-col items-center gap-1">
  <div className="bg-red-100 p-3 rounded-xl text-red-700">
    <Printer size={22}/>
  </div>
  <span className="text-[10px] font-bold text-gray-500">PDF</span>
</button>

               <button onClick={handleExportTablePDF} className="flex flex-col items-center gap-1">
  <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
    <Layers size={22}/>
  </div>
  <span className="text-[10px] font-bold text-gray-500">Table</span>
</button>

  <button onClick={handleExportAllIDCards} className="flex flex-col items-center gap-1">
  <div className="bg-indigo-100 p-3 rounded-xl text-indigo-700">
    <IdCard size={22}/>
  </div>
  <span className="text-[10px] font-bold text-gray-500">ID</span>
</button>

              </div>
            </div>

          <div className="flex justify-between items-center mb-4 px-1">
          
  <h3 className="font-extrabold text-xl text-slate-800">Students</h3>

  <div className="flex gap-2 items-center">

    {currentUser?.role === "Admin" && (
      <select
        value={adminClassFilter}
        onChange={e => setAdminClassFilter(e.target.value)}
        className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold"
      >
        <option value="All">All Classes</option>
        {Object.keys(CLASS_ORDER).map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    )}

 <select
  value={`${sortConfig.field}_${sortConfig.order}`}
  onChange={e => {
    const [field, order] = e.target.value.split('_');
    setSortConfig({ field, order });
  }}
  className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold"
>
  <option value="_">Sort</option>
  <option value="name_asc">Name ↑ (A-Z)</option>
  <option value="name_desc">Name ↓ (Z-A)</option>
  <option value="roll_asc">Roll ↑</option>
  <option value="roll_desc">Roll ↓</option>
  <option value="class_asc">Class ↑</option>
  <option value="class_desc">Class ↓</option>
  <option value="time_desc">New → Old</option>
  <option value="time_asc">Old → New</option>
</select>

  </div>
</div>


            {loading && students.length === 0 ? (
               <div className="space-y-3">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse"/>)}
               </div>
            ) : (
              filteredList.map((s, i) => (
                <StudentRow 
  key={i} 
  data={s} 
  onClick={(data) => {
    setScrollPos(window.scrollY); // 👈 exact position save
    setDetailData(data);
  }} 
/>
              ))
            )}
          </div>
        </>
      )}


      {/* --- SEARCH VIEW --- */}
      {tab === 'search' && !detailData && (
        <div className="pt-6 px-4 h-screen flex flex-col">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-4 text-gray-400" size={20}/>
            <input 
              autoFocus
              className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-slate-900 font-bold text-lg placeholder:font-medium placeholder:text-gray-300"
              placeholder="Search by Name, ID or Roll..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto pb-24 space-y-3">
             {filteredList.map((s, i) => <StudentRow key={i} data={s} onClick={setDetailData} />)}
          </div>
        </div>
      )}

      {/* --- ADD/EDIT FORM VIEW --- */}
      {tab === 'add' && (
        <div className="pt-20 px-5 pb-10">
          <Header title={isEdit ? "Update Info" : "New Admission"} action={<div/>}/>
          <FullForm 
  initialData={isEdit ? detailData : null} 
  currentUser={currentUser}
  onSave={handleSave} 
            
  onCancel={() => { setTab('home'); setIsEdit(false); setDetailData(null); }}
showToast={showToast}
            />
        </div>
      )}

      {/* --- DETAIL VIEW --- */}
      {detailData && !isEdit && (
        <DetailView 
          data={detailData} 
          onBack={() => setDetailData(null)}
          onEdit={() => { setIsEdit(true); setTab('add'); }} 
          onDelete={() => handleDelete(detailData.ID)}
        />
      )}

      {/* --- BOTTOM NAV --- */}
      {!detailData && tab !== 'add' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 h-20 px-6 flex justify-between items-end pb-3 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <NavTab icon={Home} label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
           <NavTab icon={UserPlus} label="Add" main onClick={() => { setIsEdit(false); setTab('add'); }} />
           <NavTab icon={Search} label="Search" active={tab === 'search'} onClick={() => setTab('search')} />
        </div>
      )}
      {/* ============ PROFESSIONAL TOAST NOTIFICATION ============ */}
      {toast.show && (
        <>
          {/* Custom CSS for Animation - এটি এনিমেশন নিশ্চিত করবে */}
          <style>{`
            @keyframes slideDown {
              0% { transform: translateY(-100%) scale(0.8); opacity: 0; }
              60% { transform: translateY(10px) scale(1.02); opacity: 1; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes shrinkWidth {
              from { width: 100%; }
              to { width: 0%; }
            }
            .animate-toast-entry {
              animation: slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .animate-progress {
              animation: shrinkWidth 3s linear forwards;
            }
          `}</style>

          <div className="fixed top-0 left-0 right-0 z-[1000] flex justify-center pt-6 pointer-events-none">
            <div className="animate-toast-entry pointer-events-auto relative overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl w-[90%] max-w-sm">
              
              {/* Main Content */}
              <div className="flex items-center gap-4 p-4">
                {/* Icon Box */}
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  toast.type === 'success' 
                    ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-green-200' 
                    : 'bg-gradient-to-br from-red-400 to-pink-600 text-white shadow-red-200'
                }`}>
                  {toast.type === 'success' ? <Check size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-black uppercase tracking-wider mb-0.5 ${
                    toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {toast.type === 'success' ? 'Success' : 'Attention'}
                  </h4>
                  <p className="text-slate-600 text-xs font-bold leading-relaxed">
                    {toast.msg}
                  </p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setToast(prev => ({ ...prev, show: false }))}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Bar Line */}
              <div className={`h-1 w-full ${
                toast.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                <div className={`h-full animate-progress ${
                  toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
              </div>

            </div>
          </div>
        </>
      )}
      {/* ============ END PROFESSIONAL TOAST ============ */}


    </div>
  );
};

// ==============================================
// LOGIN PAGE COMPONENT (FIREBASE)
// ==============================================
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // Successful login will trigger onAuthStateChanged in App
    } catch (err) {
      console.error(err);
      if(err.code === 'auth/user-not-found') setError("ইমেইল পাওয়া যায়নি");
      else if(err.code === 'auth/wrong-password') setError("ভুল পাসওয়ার্ড");
      else setError("লগিন ব্যর্থ হয়েছে");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-black text-center mb-2 text-slate-800">
          স্বাগতম
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">{CONFIG.APP_NAME}</p>

        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
        <input 
          type="email"
          placeholder="Enter Your Email"
          className="w-full p-4 mb-4 bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 rounded-xl outline-none font-bold transition-all"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
        <input 
          type="password"
          placeholder="******"
          className="w-full p-4 mb-4 bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 rounded-xl outline-none font-bold transition-all"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />

        {error && (
          <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={16}/> {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin"/> : "Login"}
        </button>
      </div>
    </div>
  );
};

// ==============================================
// 5. COMPLEX COMPONENTS (VALIDATED & STACKED)
// ==============================================

const FullForm = ({ initialData, currentUser, onSave, onCancel, showToast }) => {
  const isUpdate = !!initialData;
  const defaultState = {
    sessionYear: new Date().getFullYear().toString(),
    studentId: '',
    studentNameBn: '', studentNameEn: '',  gender: '', roll: '', classBn: '', brn: '', dob: '', bloodGroup: '',
    fatherNameBn: '', motherNameBn: '', whatsappNumber: '', emergencyNumber: '',
    fatherNameEn: '', motherNameEn: '',
    houseNameBn: '', villageBn: 'মীরেরখীল', unionBn: 'সরফভাটা', wardNo: '', upazilaBn: 'রাঙ্গুনিয়া', districtBn: 'চট্টগ্রাম',
    imageUrl: '',
     villageEn: 'Mirerkhil',
    unionEn: 'Sarfbhata',
  upazilaEn: 'Rangunia',
  districtEn: 'Chattogram',
  };

  const [form, setForm] = useState(defaultState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      const parseDate = (dStr) => {
  if (!dStr) return '';

  // যদি already YYYY-MM-DD হয়
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
    return dStr;
  }

  // অন্য সব কিছুর জন্য safe parse
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return '';

  // লোকাল ডেট বানিয়ে string
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${y}-${m}-${day}`;
};
      
      setForm({
        sessionYear: initialData.Session || '',
        studentId: initialData.ID || '',
        studentNameBn: initialData.StudentNameBn || '',
        studentNameEn: initialData.StudentNameEn || '',
        gender: initialData.Gender || '',
        roll: initialData.Roll || '',
        classBn: initialData.ClassBn || '',
        brn: initialData.BRN || '',
        dob: parseDate(initialData.DOB),
        bloodGroup: initialData.BloodGroup || '',
        fatherNameBn: initialData.FatherNameBn || '',
        fatherNameEn: initialData.FatherNameEn || '',
        motherNameBn: initialData.MotherNameBn || '',
        motherNameEn: initialData.MotherNameEn || '',
        whatsappNumber: initialData.WhatsApp || '',
        emergencyNumber: initialData.EmergencyNo || '',
        houseNameBn: initialData.HouseNameBn || '',
        houseNameEn: initialData.HouseNameEn || '',
        villageBn: initialData.VillageBn || '',
        villageEn: initialData.VillageEn || '',
        unionBn: initialData.UnionBn || '',
        unionEn: initialData.UnionEn || '',
        wardNo: initialData.WardNo || '',
        upazilaBn: initialData.UpazilaBn || '',
        upazilaEn: initialData.UpazilaEn || '',
        districtBn: initialData.DistrictBn || '',
        districtEn: initialData.DistrictEn || '',
        imageUrl: initialData.ImageURL || ''
      });
      setImgPreview(initialData.ImageURL || null);
    } else {
      setForm(defaultState);
      setImgPreview(null);
    }
  }, [initialData]);
useEffect(() => {
  if (!initialData && currentUser?.role === "Class") {
    setForm(f => ({ ...f, classBn: currentUser.classBn }));
  }
}, [initialData, currentUser]);
  // SMART ID GENERATION
  useEffect(() => {
    if (!initialData && form.sessionYear && form.dob && form.classBn && form.roll) {
      try {
        const year = form.sessionYear;
        const dobYear = new Date(form.dob).getFullYear().toString().slice(-2);
        
        const classMap = {
          'প্লে': '99', 'নার্সারি': '00', 'কেজি': '98',
          '১ম': '01', '২য়': '02', '৩য়': '03', '৪র্থ': '04', '৫ম': '05',
          '৬ষ্ঠ': '06', '৭ম': '07', '৮ম': '08', '৯ম': '09', '১০ম': '10'
        };
        const classCode = classMap[form.classBn] || '00';
        const rollCode = form.roll.toString().padStart(2, '0');
        
        setForm(prev => ({...prev, studentId: `${year}${dobYear}${classCode}${rollCode}`}));
      } catch (e) {}
    }
  }, [form.sessionYear, form.dob, form.classBn, form.roll, initialData]);

  const update = (f, v) => {
    setForm(p => ({...p, [f]: v}));
    if(errors[f]) setErrors(p => ({...p, [f]: ''}));
  };

  // --- STRICT VALIDATION LOGIC ---
  const validate = () => {
    let newErrors = {};

    if (step === 1) {
      if(!form.studentNameBn) newErrors.studentNameBn = 'নাম আবশ্যক';
      else if(!REGEX.BANGLA.test(form.studentNameBn)) newErrors.studentNameBn = 'বাংলায় লিখুন';

      if(!form.studentNameEn) newErrors.studentNameEn = 'ইংরেজি নাম আবশ্যক';
      else if(!REGEX.ENGLISH.test(form.studentNameEn)) newErrors.studentNameEn = 'English Only';

      if(!form.roll) newErrors.roll = 'রোল আবশ্যক';
      if(!form.classBn) newErrors.classBn = 'শ্রেণি আবশ্যক';
      if (!form.gender) newErrors.gender = 'জেন্ডার আবশ্যক';
      if(!form.brn) newErrors.brn = 'জন্মনিবন্ধন আবশ্যক';
      if(!form.dob) newErrors.dob = 'জন্ম তারিখ আবশ্যক';
    }

    if (step === 2) {
      if(!form.fatherNameBn) newErrors.fatherNameBn = 'পিতার নাম আবশ্যক';
      else if(!REGEX.BANGLA.test(form.fatherNameBn)) newErrors.fatherNameBn = 'বাংলায় লিখুন';

      if(!form.motherNameBn) newErrors.motherNameBn = 'মাতার নাম আবশ্যক';
      else if(!REGEX.BANGLA.test(form.motherNameBn)) newErrors.motherNameBn = 'বাংলায় লিখুন';
      
      // Optional English check
      if(form.fatherNameEn && !REGEX.ENGLISH.test(form.fatherNameEn)) newErrors.fatherNameEn = 'English Only';
      if(form.motherNameEn && !REGEX.ENGLISH.test(form.motherNameEn)) newErrors.motherNameEn = 'English Only';

      if(!form.whatsappNumber) newErrors.whatsappNumber = 'মোবাইল নম্বর আবশ্যক';
      else if(!REGEX.MOBILE.test(form.whatsappNumber)) newErrors.whatsappNumber = 'সঠিক নম্বর দিন';
    }

    if (step === 3) {
      if(!form.villageBn) newErrors.villageBn = 'গ্রাম আবশ্যক';
      else if(!REGEX.BANGLA.test(form.villageBn)) newErrors.villageBn = 'বাংলায় লিখুন';
      if(!form.wardNo) newErrors.wardNo = 'ওয়ার্ড আবশ্যক';
    }

    if (step === 4) {
      if(!form.imageUrl) {
        newErrors.imageUrl = 'ছবি আবশ্যক';
        showToast("দয়া করে ছবি আপলোড করুন", "error"); 
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };
  const handleSubmit = () => { if (validate()) onSave(form); };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file){
       const reader = new FileReader();
       reader.onload = (ev) => {
          const img = new Image();
          img.src = ev.target.result;
          img.onload = () => {
             if (Math.abs(img.width - img.height) > 20) { 
                showToast("দুঃখিত! ছবিটি অবশ্যই স্কয়ার হতে হবে", "error");
                e.target.value = ""; return;
             }
             const cvs = document.createElement('canvas');
             const ctx = cvs.getContext('2d');
             cvs.width = 500; cvs.height = 500;
             ctx.drawImage(img, 0, 0, 500, 500);
             const url = cvs.toDataURL('image/jpeg', 0.85);
             setImgPreview(url);
             update('imageUrl', url);
          }
       }
       reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[70vh] flex flex-col">
      <div className="flex justify-between mb-8 px-2">
         {[1,2,3,4].map(s => <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step >= s ? 'w-full bg-slate-900 mx-1' : 'w-full bg-gray-100 mx-1'}`}/>)}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Step 1: Basic Info</h3>
             <Input label="Session" type="number" val={form.sessionYear} set={v=>update('sessionYear', v)} />
             
             {/* STACKED INPUTS (One per line) */}
             <Input label="নাম (বাংলা)" val={form.studentNameBn} set={v=>update('studentNameBn', v)} error={errors.studentNameBn} />
             <Input label="Name (English)" val={form.studentNameEn} set={v=>update('studentNameEn', v)} error={errors.studentNameEn} />
             
             <Input label="Roll" type="number" val={form.roll} set={v=>update('roll', v)} error={errors.roll} />
             
             <div className="relative pt-1 w-full">
               <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Class</label>
               <select className={`w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border ${errors.classBn ? 'border-red-500' : 'border-transparent'}`} value={form.classBn} onChange={e=>update('classBn', e.target.value)}>
                  <option value="">Select...</option>
                  {['প্লে', 'নার্সারি', 'কেজি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map(c=><option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div className="relative pt-1 w-full">
  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">
    Gender
  </label>
  <select
    className={`w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border 
      ${errors.gender ? 'border-red-500' : 'border-transparent'}`}
    value={form.gender}
    onChange={e => update('gender', e.target.value)}
  >
    <option value="">Select...</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
</div>
             <Input label="BIRTH REGISTRATION NUMBER" type="number" val={form.brn} set={v=>update('brn', v)} error={errors.brn} />
             <Input label="DATE OF BIRTH" type="date" val={form.dob} set={v=>update('dob', v)} error={errors.dob} />
             
             <div className="relative pt-1 w-full">
                 <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Blood Group</label>
                 <select className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-transparent" value={form.bloodGroup} onChange={e=>update('bloodGroup', e.target.value)}>
                    <option value="">N/A</option>
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(c=><option key={c} value={c}>{c}</option>)}
                 </select>
             </div>

             <div className="mt-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Input label="Student ID (Auto)" type="number" val={form.studentId} set={v=>update('studentId', v)} error={errors.studentId} />
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Step 2: Parents Info</h3>
             <Input label="পিতার নাম (বাংলা)" val={form.fatherNameBn} set={v=>update('fatherNameBn', v)} error={errors.fatherNameBn} />
             
             <Input label="Father Name (English) - Optional" 
               val={form.fatherNameEn} 
               set={v=>update('fatherNameEn', v)}
               error={errors.fatherNameEn} />

             <Input label="মাতার নাম (বাংলা)" val={form.motherNameBn} set={v=>update('motherNameBn', v)} error={errors.motherNameBn} />

             <Input label="Mother Name (English) - Optional" 
               val={form.motherNameEn} 
               set={v=>update('motherNameEn', v)}
               error={errors.motherNameEn} />

             <Input label="Mobile (WhatsApp)" type="tel" val={form.whatsappNumber} set={v=>update('whatsappNumber', v)} error={errors.whatsappNumber} />
             <Input label="Emergency No" type="tel" val={form.emergencyNumber} set={v=>update('emergencyNumber', v)} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Step 3: Address (Bangla Only)</h3>
             <Input label="বাড়ির নাম" val={form.houseNameBn} set={v=>update('houseNameBn', v)} />
             <Input label="গ্রাম (বাংলা)" val={form.villageBn} set={v=>update('villageBn', v)} error={errors.villageBn} />
             <Input label="ইউনিয়ন (বাংলা)" val={form.unionBn} set={v=>update('unionBn', v)} />
             <Input label="Ward No" type="number" val={form.wardNo} set={v=>update('wardNo', v)} error={errors.wardNo} />
             <Input label="উপজেলা (বাংলা)" val={form.upazilaBn} set={v=>update('upazilaBn', v)} />
             <Input label="জেলা (বাংলা)" val={form.districtBn} set={v=>update('districtBn', v)} />
            <>
  <Input label="House Name (English) - Optional" 
    val={form.houseNameEn} 
    set={v=>update('houseNameEn', v)} />

  <Input label="Village (English) - Optional" 
    val={form.villageEn} 
    set={v=>update('villageEn', v)} />

  <Input label="Union (English) - Optional" 
    val={form.unionEn} 
    set={v=>update('unionEn', v)} />

  <Input label="Upazila (English) - Optional" 
    val={form.upazilaEn} 
    set={v=>update('upazilaEn', v)} />

  <Input label="District (English) - Optional" 
    val={form.districtEn} 
    set={v=>update('districtEn', v)} />
</>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 py-6">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Step 4: Student Photo</h3>
             <div className={`relative w-56 h-56 bg-gray-100 rounded-full flex items-center justify-center border-[6px] shadow-2xl ring-1 overflow-hidden ${errors.imageUrl ? 'border-red-500 ring-red-200' : 'border-white ring-gray-100'}`}>
                {imgPreview ? <img src={imgPreview} className="w-full h-full object-cover"/> : <Camera size={48} className="text-gray-300"/>}
                <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"/>
             </div>
             {errors.imageUrl && <p className="text-red-500 text-xs font-bold mt-2">ছবি আবশ্যক</p>}
             <p className="mt-8 text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full text-center">Tap photo to upload <br/><span className="text-xs text-gray-400">(Square Only)</span></p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
         {step > 1 ? <button onClick={()=>setStep(s=>s-1)} className="font-bold text-gray-400 px-6 py-3 bg-gray-50 rounded-xl">Back</button> : <button onClick={onCancel} className="font-bold text-red-400 px-4 py-3">Cancel</button>}
         {step < 4 ? (
            <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">Next <ArrowRight size={18}/></button>
         ) : (
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-200">Submit <Check size={18}/></button>
         )}
      </div>
    </div>
  );
};

const Input = ({ label, val, set, type="text", error }) => (
  <div className="relative pt-1 w-full">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-0.5 block flex justify-between">
      {label}
      {error && <span className="text-red-500 lowercase italic">{error}</span>}
    </label>
    <input 
      type={type} 
      className={`w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 font-bold text-slate-800 transition-all border placeholder-gray-300 ${error ? 'border-red-500 ring-1 ring-red-200' : 'border-transparent'}`}
      placeholder="..."
      value={val}
      onChange={e => set(e.target.value)}
    />
  </div>
);

// 3. FULL DETAIL VIEW WITH UPDATED PRINT BUTTONS & LOGIC
const DetailView = ({ data, onBack, onEdit, onDelete }) => {
  // নতুন কোড (এটি দিয়ে রিপ্লেস করুন)
const formatDate = (dateStr) => {
  if(!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    // ইংরেজি ফরম্যাট (English GB)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }); 
  } catch(e) { return dateStr; }
};

const handlePrintIDCard = () => {
  const w = window.open('', '_blank');
  w.document.write(`
  <html>
    <head>
      <title>ID Card: ${data.ID}</title>
      <style>
      @media print {
  @page { size: A4; margin: 0; }
  body { background: white; }
}

body {
  width: 210mm;
  height: 297mm;
  margin: 15;
  display: flex;
  justify-content: top;
  align-items: top;
}



        .id-card {
           width: 2.125in;
  height: 3.37in;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #1e3a8a;
          text-align: center;
          position: relative;
        }

        .header {
          background: #1e3a8a;
          color: white;
          padding: 8px 0;
        }

        .header h2 { margin: 0; font-size: 12px; }
        .header p { margin: 0; font-size: 9px; opacity: 0.8; }

        .photo {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 2px solid #1e3a8a;
          object-fit: cover;
          margin-top: 7px;
        }

        .name-section { margin-top: 5px; }
        .name-en { font-size: 12px; font-weight: bold; }
        .name-bn { font-size: 10px; color: #555; }
        .student-id { 
          display: inline-block; 
          background: #1e3a8a; 
          color: white; 
          padding: 2px 8px; 
          border-radius: 12px; 
          font-size: 8px; 
          margin-top: 4px;
        }

        .details-grid {
          margin-top: 7px;
          padding: 0 10px;
          text-align: left;
          font-size: 9px;
        }
.address{
         
          font-size: 8px;
        }
        .row { 
          display: flex; 
          justify-content: space-between; 
          border-bottom: 1px solid #eee; 
          padding: 2px 0; 
        }

        .label { font-weight: bold; color: #555; }
        .value { font-weight: bold; color: #222; }

        .footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: #1e3a8a;
          height: 6px;
        }

        .principal {
          position: absolute;
          bottom: 7px;
          right: 20px;
          text-align: center;
          width: 80px;
          border-top: 1px solid #333;
          font-size: 5px;
        }
      </style>
    </head>

    <body>
      <div class="id-card">
        <div class="header">
          <h2>${CONFIG.APP_NAME}</h2>
          <p>Rangunia, Chattogram</p>
        </div>

        <img src="${data.ImageURL}" class="photo" />

        <div class="name-section">
          <div class="name-en">${data.StudentNameEn}</div>
          <div class="name-bn">${data.StudentNameBn}</div>
          <div class="student-id">ID: ${data.ID}</div>
        </div>

        <div class="details-grid">
          <div class="row"><span class="label">Class/Roll</span><span class="value">${data.ClassEn}/${data.Roll}</span></div>
          
                   <div class="row"><span class="label">Father</span><span class="value">${data.FatherNameBn}</span></div>
          <div class="row"><span class="label">Mother</span><span class="value">${data.MotherNameBn}</span></div> 
          <div class="row"><span class="label">DOB</span><span class="value">${formatDate(data.DOB)}</span></div>
          <div class="row"><span class="label">Blood</span><span class="value">${data.BloodGroup}</span></div>
          <div class="row"><span class="label">Mobile</span><span class="value">${data.WhatsApp}</span></div>

<div class="row "><span class="label">Address</span><span class="value address">${data.HouseNameBn}
</span></div>
<div class="row"><span class="label"></span><span class="value address">${data.VillageBn},
${data.UnionBn}, ${data.UpazilaBn},
${data.DistrictBn}</span></div>
        </div>

        <div class="principal">Principal</div>
        <div class="footer"></div>
      </div>
    </body>
  </html>
  `);

  w.document.close();
};
  const handlePrintProfile = () => {
    const w = window.open('','_blank');
    w.document.write(`
      <html>
        <head>
          <title>Profile: ${data.ID}</title>
          <style>
            @media print { @page { size: A5; margin: 1cm; } }
            body { font-family: sans-serif; padding: 0; margin: 0; font-size: 11px; }
            .container { border: 2px solid #333; padding: 15px; height: 100%; box-sizing: border-box; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
            .header h1 { margin: 0; font-size: 18px; }
            .row { display: flex; margin-bottom: 3px; border-bottom: 1px dotted #ccc; padding-bottom: 1px; }
            .label { width: 130px; font-weight: bold; color: #555; }
            .value { flex: 1; font-weight: bold; color: #000; }
            .photo { position: absolute; top: 80px; right: 10px; width: 80px; height: 80px; border: 1px solid #000; object-fit: cover; }
            .section { margin-top: 15px; margin-bottom: 5px; background: #eee; padding: 2px 5px; font-weight: bold; text-transform: uppercase; font-size: 10px; border-left: 3px solid #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${CONFIG.APP_NAME}</h1>
              <p>Official Student Profile Record</p>
            </div>
            <img src="${data.ImageURL}" class="photo" />

            <div class="section">Basic Information</div>
            <div class="row"><span class="label">Student ID:</span><span class="value">${data.ID}</span></div>
            <div class="row"><span class="label">Name (Bn):</span><span class="value">${data.StudentNameBn}</span></div>
            <div class="row"><span class="label">Name (En):</span><span class="value">${data.StudentNameEn}</span></div>
            <div class="row"><span class="label">Class:</span><span class="value">${data.ClassEn} (${data.ClassBn})</span></div>
            
            <div class="row"><span class="label">Roll / Session:</span><span class="value">${data.Roll}</span></div>
            <div class="row"><span class="label">Roll:</span><span class="value">$${data.Session}</span></div>
            <div class="row"><span class="label">Date of birth:</span><span class="value">${formatDate(data.DOB)}</span></div>
          <div  class="row"><span class="label">Blood : </span> <span class="value"> ${data.BloodGroup}</span></div>
            <div  <div class="row"><span class="label">Birth Certificate:</span><span class="value">${data.BRN}</span></div>
  <div class="row"><span class="label">Gender:</span><span class="value">${data.Gender}</span></div>

            <div class="section">Guardian Information</div>
            <div class="row"><span class="label">Father (Bn):</span><span class="value">${data.FatherNameBn}</span></div>
            <div class="row"><span class="label">Father (En):</span><span class="value">${data.FatherNameEn}</span></div>
            <div class="row"><span class="label">Mother (Bn):</span><span class="value">${data.MotherNameBn}</span></div>
            <div class="row"><span class="label">Mother (En):</span><span class="value">${data.MotherNameEn}</span></div>
            <div class="row"><span class="label">Mobile:</span><span class="value">${data.WhatsApp}</span></div>
            <div class="row"><span class="label">Emergency:</span><span class="value">${data.EmergencyNo}</span></div>

            <div class="section">Address Details</div>
            <div class="row"><span class="label">House:</span><span class="value">${data.HouseNameEn} (${data.HouseNameBn})</span></div>
            <div class="row"><span class="label">Village:</span><span class="value">${data.VillageEn} (${data.VillageBn})</span></div>
            <div class="row"><span class="label">Union/Ward:</span><span class="value">${data.UnionEn} (${data.UnionBn}) / Ward ${data.WardNo}</span></div>
            <div class="row"><span class="label">Area:</span><span class="value">${data.UpazilaEn}, ${data.DistrictEn}</span></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  const handleWhatsApp = () => {
  const phone = data.WhatsApp?.replace(/['"\s-]/g,'');
  if(!phone) return alert("নম্বর নেই");

const msg = `
———————————————————————
  *ABDUR RAZZAK DAKHIL MADRASAH*
———————————————————————

👤 *STUDENT PROFILE*
• Name  : ${data.StudentNameEn} 
• নাম  : ${data.StudentNameBn}
• ID          : ${data.ID}
• Class       : ${data.ClassEn}
• Roll        : ${data.Roll}
• Session     : ${data.Session}
• Date of Birth : ${formatDate(data.DOB)}
• Blood Group : ${data.BloodGroup}
• Gender      : ${data.Gender}
• BRN         : ${data.BRN}

👪 *GUARDIAN DETAILS*
• Father : ${data.FatherNameEn}
• পিতা :  ${data.FatherNameBn}
• Mother : ${data.MotherNameEn}
• মাতা : ${data.MotherNameBn}

📞 *CONTACT INFO*
• Mobile    : ${data.WhatsApp}
• Emergency : ${data.EmergencyNo}

🏠 *ADDRESS*
${data.HouseNameEn}, ${data.VillageEn}, ${data.UnionEn}, ${data.UpazilaEn}, ${data.DistrictEn}.
${data.HouseNameBn}, ${data.VillageBn}, ${data.UnionBn}, ${data.UpazilaBn}, ${data.DistrictBn}।

✅ *REGISTRATION SUCCESSFUL*
Your student profile has been created.`.trim();


    
  window.open(`https://wa.me/+88${phone}?text=${encodeURIComponent(msg)}`);
};
  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto animate-in slide-in-from-bottom duration-300">
      <div className="relative h-80 bg-slate-900">
        <img src={data.ImageURL} className="w-full h-full object-cover opacity-30 blur-sm" alt=""/>
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        <button onClick={onBack} className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur rounded-full text-white"><ChevronLeft/></button>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <img src={data.ImageURL} className="w-40 h-40 rounded-full border-8 border-white shadow-2xl bg-white object-cover" alt=""/>
        </div>
      </div>

      <div className="mt-24 px-6 text-center pb-10">
        <h1 className="text-3xl font-black text-slate-900 leading-tight">{data.StudentNameEn}</h1>
        <p className="text-lg text-gray-500 font-bold mt-1">{data.StudentNameBn}</p>
        <p className="text-sm font-mono font-bold text-blue-600 mt-1 tracking-widest">ID: {data.ID}</p>
        
        <div className="flex justify-center gap-3 mt-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700"> Class {data.ClassEn || data.ClassBn}</span>
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-700">Roll {data.Roll}</span>
          {data.BloodGroup && <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-700">{data.BloodGroup}</span>}
       
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex justify-center gap-4 mt-8 mb-6 pb-6 border-b border-gray-100 flex-wrap">
          <ActionBtn icon={Phone} label="Call" bg="bg-emerald-50 text-emerald-600" onClick={() => window.open(`tel:${data.WhatsApp ? data.WhatsApp.replace(/['"]/g, '') : ''}`)} />
          <ActionBtn icon={MessageCircle} label="WhatsApp" bg="bg-emerald-500 text-white shadow-emerald-200" onClick={handleWhatsApp} />
          <ActionBtn icon={CreditCard} label="ID Card" bg="bg-indigo-500 text-white shadow-indigo-200" onClick={handlePrintIDCard} />
          <ActionBtn icon={FileText} label="Print Info" bg="bg-slate-800 text-white shadow-slate-300" onClick={handlePrintProfile} />
        </div>

        <div className="text-left space-y-6">
           <InfoCard title="Parents Info" icon={Users} items={[
             {l: 'পিতার নাম', v: `${data.FatherNameBn}`},
             {l: 'Father Name', v: `${data.FatherNameEn} `},
            {l: 'মাতার নাম', v: `${data.MotherNameBn}`},
       {l: 'Mother Name', v: `${data.MotherNameEn}`},
           ]}/>
           <InfoCard title="Contact & Personal" icon={Shield} items={[
             {l: 'Mobile', v: data.WhatsApp},
             {l: 'Emergency', v: data.EmergencyNo},
             {l: 'Date of Birth', v: formatDate(data.DOB)},
             {l: 'BRN', v: data.BRN ? data.BRN.toString().replace(/['"]/g, '') : ''},
      {l: 'Gender', v: data.Gender},
    ]}/>
           <InfoCard title="Address Details" icon={MapPin} items={[
             {l: 'House', v: `${data.HouseNameEn} (${data.HouseNameBn})`},
             {l: 'Village', v: `${data.VillageEn} (${data.VillageBn})`},
             {l: 'Union/Ward', v: `${data.UnionEn} (${data.UnionBn}) / Ward ${data.WardNo}`},
             {l: 'Area', v: `${data.UpazilaEn}, ${data.DistrictEn}`},
           ]}/>
        </div>

        <div className="mt-10 flex gap-4 sticky bottom-6">
           <button onClick={onEdit} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition">
             <Edit3 size={20}/> Edit Profile
           </button>
           <button onClick={() => onDelete(data.ID)} className="w-16 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center active:scale-95 transition">
             <Trash2 size={24}/>
           </button>
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ icon: Icon, label, bg, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition group-active:scale-90 ${bg}`}>
      <Icon size={24}/>
    </div>
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
  </button>
);

const InfoCard = ({ title, icon: Icon, items }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
      <Icon size={18} className="text-blue-600"/>
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase">{item.l}</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5">{item.v || 'N/A'}</span>
        </div>
      ))}
    </div>
  </div>
);

export default App;
