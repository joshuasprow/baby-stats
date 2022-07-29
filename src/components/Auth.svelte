<script lang="ts">
  import { signInWithPopup } from "firebase/auth";
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { auth, googleProvider } from "../lib/firebase";

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("signed in/up");
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await signOut();
      console.log("signed out");
    } catch (error) {
      console.error(error);
    }
  };
</script>

<button on:click={signIn}><GoogleIcon /></button>
<button on:click={signOut}>Sign out</button>
