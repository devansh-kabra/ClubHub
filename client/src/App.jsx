import Loading from './components/Loading';
import AppRoutes from './routes/routes'
import { useQuery } from '@tanstack/react-query'

async function readCookies() {
  const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
    method: "GET",
    credentials: "include",
  });
  const info = await result.json();

  if (info.code === 'N') {
    return ({
      userType: null,
      userData: null
    });
  }
  else if (info.code === "S") {
    return ({
      userType: "student",
      userData: {
        username: info.username,
      }
    });
  }
  else {
    return ({
      userType: "club",
      userData: {
        username: info.username,
        user_slug: info.user_slug,
        user_color: info.user_color,
      }
    });
  }
}

function App() {

  const userInfo = useQuery({
    queryKey: ["user"],
    queryFn: readCookies,
    staleTime: Infinity,
  });

  if (userInfo.isLoading) {
    return (<div className='h-screen w-screen flex justify-center items-center'>
      <Loading />
    </div>)
  }
  else if (userInfo.error) {
    return (<div className='h-screen w-screen'>
      <p>Server seems down! We are fixing this</p>
    </div>)
  }


  return (
    <AppRoutes/>
  )
}

export default App
