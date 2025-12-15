import { useState, useEffect } from "react";
import { userService } from "../services/api";
import useAuth from "../hooks/useAuth";

const UserProfile = () => {
  const { updateProfile, updatePassword, isLoading, error } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    photoPreview: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getMe();
        const userData = response.data?.data?.data;
        if (!userData) return;

        setUser(userData);
        setFormData({
          name: userData.name || "",
          photoPreview: userData.photo,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("photo", formData.photo);
    if (await updateProfile(form)) alert("Cập nhật thông tin thành công!");
    else setTimeout(() => alert(error), 100);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (
      await updatePassword(passwords.current, passwords.new, passwords.confirm)
    )
      alert("Mật khẩu cập nhật thành công!");
    else setTimeout(() => alert(error), 100);
  };

  if (!user)
    return <p className="text-center">Đang tải dữ liệu người dùng...</p>;

  return (
    <main className="flex-1 relative bg-gray-100 px-24 py-32">
      <div className="flex max-w-[120rem] min-h-screen mx-auto overflow-hidden bg-white rounded-md shadow-[0_2.5rem_8rem_2rem_rgba(0,0,0,0.07)]">
        <nav className="flex-[0_0_32rem] bg-gradient-to-br from-[#77dada] to-[#0b7070] py-16">
          <ul className="list-none">
            <NavItem link="#" text="Cài Đặt" icon="settings" active={true} />
            <NavItem link="#" text="Tour Của Tôi" icon="briefcase" />
            <NavItem link="#" text="Đánh Giá" icon="star" />
            <NavItem link="#" text="Lịch Sử Thanh Toán" icon="credit-card" />
          </ul>
        </nav>
        <div className="flex-1 py-28">
          <div className="max-w-[68rem] px-32 mx-auto">
            <h2 className="text-3xl font-bold uppercase bg-gradient-to-r from-[#77dada] to-[#0b7070] text-transparent bg-clip-text mb-12">
              Cài đặt tài khoản
            </h2>
            <form className="space-y-10" onSubmit={handleUpdate}>
              <div>
                <label htmlFor="name" className="block text-lg font-bold mb-3">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="block w-full text-base px-7 py-5 bg-gray-100 rounded border-t-4 border-b-4 border-transparent focus:outline-none focus:border-b-[#77dada]"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-bold mb-3">
                  Tài khoản email
                </label>
                <input
                  id="email"
                  type="email"
                  className="block w-full text-base px-7 py-5 bg-gray-100 rounded"
                  value={user.email}
                  required
                  disabled
                />
              </div>
              <div className="flex items-center text-lg">
                <img
                  className="w-[7.5rem] h-[7.5rem] rounded-full mr-8"
                  src={
                    formData?.photo instanceof File
                      ? URL.createObjectURL(formData.photo)
                      : formData.photoPreview
                  }
                  alt="user"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-left">
                <button
                  className="text-white bg-[#77dada] text-sm uppercase py-5 px-12 rounded-full hover:shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang tải..." : "Lưu cài đặt"}
                </button>
              </div>
            </form>
          </div>

          <div className="my-10 h-[1px] bg-gray-200"></div>

          <div className="max-w-[68rem] px-32 mx-auto">
            <h2 className="text-3xl font-bold uppercase bg-gradient-to-r from-[#77dada] to-[#0b7070] text-transparent bg-clip-text mb-12">
              Đổi mật khẩu
            </h2>
            <form className="space-y-10" onSubmit={handlePasswordUpdate}>
              <div>
                <label
                  htmlFor="password-current"
                  className="block text-lg font-bold mb-3"
                >
                  Mật khẩu hiện tại
                </label>
                <input
                  id="password-current"
                  type="password"
                  placeholder="••••••••"
                  name="current"
                  required
                  minLength="8"
                  onChange={handlePasswordChange}
                  className="block w-full text-base px-7 py-5 bg-gray-100 rounded border-t-4 border-b-4 border-transparent focus:outline-none focus:border-b-[#77dada]"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-bold mb-3"
                >
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  name="new"
                  required
                  minLength="8"
                  onChange={handlePasswordChange}
                  className="block w-full text-base px-7 py-5 bg-gray-100 rounded border-t-4 border-b-4 border-transparent focus:outline-none focus:border-b-[#77dada]"
                />
              </div>
              <div>
                <label
                  htmlFor="password-confirm"
                  className="block text-lg font-bold mb-3"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="password-confirm"
                  type="password"
                  placeholder="••••••••"
                  name="confirm"
                  required
                  minLength="8"
                  onChange={handlePasswordChange}
                  className="block w-full text-base px-7 py-5 bg-gray-100 rounded border-t-4 border-b-4 border-transparent focus:outline-none focus:border-b-[#77dada]"
                />
              </div>
              <div className="text-left">
                <button
                  className="text-white bg-[#77dada] text-sm uppercase py-5 px-12 rounded-full hover:shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

const NavItem = ({ link, text, icon, active }) => (
  <li
    className={
      active
        ? "border-l-4 border-white"
        : "hover:border-l-4 hover:border-white transition-all duration-300"
    }
  >
    <a
      href={link}
      className="flex items-center text-white text-sm uppercase font-normal px-16 py-4 transition-all hover:translate-x-1"
    >
      <svg className="w-5 h-5 fill-gray-100 mr-5">
        <use xlinkHref={`/images/icons.svg#icon-${icon}`} />
      </svg>
      {text}
    </a>
  </li>
);

export default UserProfile;
