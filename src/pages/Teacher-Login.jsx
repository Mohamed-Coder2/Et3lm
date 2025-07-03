import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../lib/firebase";
import logo from "../assets/logo.svg";
import toast from "react-hot-toast";

const auth = getAuth(app);
const db = getFirestore(app);

const TLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Check/update Firestore teacher record
      const userRef = doc(db, "teachers", user.uid);
      const userSnap = await getDoc(userRef);
      const now = new Date();
      let isNewTeacher = false;

      if (!userSnap.exists()) {
        const teacherId = `TEC-${Math.floor(1000 + Math.random() * 9000)}`;
        isNewTeacher = true;

        await setDoc(userRef, {
          id: user.uid,
          email: user.email,
          teacher_id: teacherId,
          subjects: [],
          classes: [],
          profilePicture: user.photoURL || "",
          name: user.displayName || "",
          createdAt: now,
          lastLogin: now,
        });
      } else {
        await setDoc(userRef, { lastLogin: now }, { merge: true });
      }

      // 3. Get teacher data from backend
      const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/by-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email
        }),
      });

      if (!backendResponse.ok) {
        throw new Error("Failed to fetch teacher data from backend");
      }

      const backendData = await backendResponse.json();

      // 4. Store teacher data in localStorage
      localStorage.setItem("teacherData", JSON.stringify({
        id: backendData.data.id,
        firstName: backendData.data.first_name,
        lastName: backendData.data.last_name,
        email: backendData.data.email,
        image: backendData.data.image,
        firebaseUid: user.uid
      }));

      // 5. Register new teacher with backend if needed
      if (isNewTeacher) {
        const [firstName = "", lastName = ""] = (user.displayName || "").split(" ");

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            firebase_uid: user.uid, // Better than sending password
          }),
        });
      }

      toast.success("Login successful!", { id: loadingToast });
      navigate("/teacher/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err.code === "auth/invalid-login-credentials"
          ? "Invalid email or password"
          : "Login failed. Please try again.",
        { id: loadingToast }
      );
    }
  };
  
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-36 h-15 mr-2" src={logo} alt="logo" />
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Teacher Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-main hover:bg-main2 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TLogin;
