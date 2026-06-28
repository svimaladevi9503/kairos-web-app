export const getProfileData = async () => {
  try {
    const res = await fetch("/api/profile");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Unable to load profile setting states", err);
  }
  return null;
};
