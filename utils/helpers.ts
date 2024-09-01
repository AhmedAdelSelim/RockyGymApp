const testEmail = (userEmail: string) => {
  const userTokens = userEmail.split("@");

  if (userTokens.length !== 2 || userTokens[0].length !== 11) return false;
  if (!userTokens[1].toLocaleLowerCase().startsWith("rockygym")) return false;
  return true;
};

const getUserProfileImage = async (userId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("profileImage")
    .select("*")
    .eq("userId", userId)
    .limit(1)
    .single();

  return data ? data.image : undefined;
};
export { testEmail, getUserProfileImage };
