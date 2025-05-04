// 역할 변경에 따라 입력 필드 표시 조절
document.getElementById("signupRole")?.addEventListener("change", function () {
  const role = this.value;
  document.getElementById("teacherCode").style.display = role === "teacher" ? "block" : "none";
  document.getElementById("studentFields").style.display = role === "student" ? "block" : "none";
});

// 회원가입 처리
document.getElementById("signupForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("signupId").value;
  const pw = document.getElementById("signupPw").value;
  const role = document.getElementById("signupRole").value;
  const code = document.getElementById("teacherCode").value;
  const name = document.getElementById("signupName")?.value || "";
  const year = document.getElementById("signupYear")?.value || "";
  const studentId = document.getElementById("signupStudentId")?.value || "";

  if (!id || !pw || !role) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  // 선생님 인증 코드 확인
  if (role === "teacher" && code !== "d") {
    alert("선생님 인증 코드가 올바르지 않습니다.");
    return;
  }

  // 학생 필드 확인
  if (role === "student" && (!year || !studentId)) {
    alert("입학년도와 학번을 입력해주세요.");
    return;
  }

  let users = [];
  try {
    const data = JSON.parse(localStorage.getItem("users"));
    users = Array.isArray(data) ? data : [];
  } catch (e) {
    users = [];
  }

  if (users.find(u => u.id === id)) {
    alert("이미 존재하는 아이디입니다.");
    return;
  }

  const userData = { id, pw, role, name };

  if (role === "student") {
    userData.year = year;
    userData.studentId = studentId;
  }

  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));

  alert("회원가입 완료!");
  window.location.href = "login.html";
});

// 로그인 처리
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("loginId").value;
  const pw = document.getElementById("loginPw").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((u) => u.id === id && u.pw === pw);

  if (userIndex === -1) {
    alert("아이디 또는 비밀번호가 잘못되었습니다.");
    return;
  }

  const user = users[userIndex];

  // 관리자 계정 특별 처리
  if (user.id === "lucy0527") {
    user.role = "admin";
    users[userIndex].role = "admin";
    localStorage.setItem("users", JSON.stringify(users)); // 갱신
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "admin_dashboard.html";
  } else {
    localStorage.setItem("currentUser", JSON.stringify(user));
    if (user.role === "teacher") {
      window.location.href = "dashboard.html?as=teacher";
    } else {
      window.location.href = "dashboard.html?as=student";
    }
  }
});
