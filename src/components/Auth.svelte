<script lang="ts">
  import { signInWithPopup, signOut, type User } from "firebase/auth";
  import { onDestroy, onMount } from "svelte";
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { auth, googleProvider } from "../lib/firebase";

  let user: null | User = null;
  let loading = true;
  let unsubscribe: null | (() => void) = null;

  onMount(() => {
    unsubscribe = auth.onAuthStateChanged(
      (u) => {
        loading = false;
        user = u;
      },
      (e) => {
        console.error(e);
      }
    );
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  const onSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };
</script>

<pre>{user?.uid}</pre>

<button disabled={loading || !!user} on:click={onSignIn}>
  <GoogleIcon disabled={loading || !!user} />
</button>

<button disabled={loading || !user} on:click={onSignOut}>Sign out</button>
