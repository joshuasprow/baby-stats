<script lang="ts">
  import { signInWithPopup, signOut } from "firebase/auth";
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { auth, googleProvider } from "../lib/firebase";
  import { user } from "../stores/user";

  let signInDisabled = !!$user;

  const onSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("signed in/up");
    } catch (error) {
      console.error(error);
    }
  };

  const onSignOut = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
    } catch (error) {
      console.error(error);
    }
  };
</script>

<button disabled={signInDisabled} on:click={onSignIn}>
  <GoogleIcon disabled={signInDisabled} />
</button>
<button on:click={onSignOut}>Sign out</button>
