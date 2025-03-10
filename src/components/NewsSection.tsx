import { useState, useEffect } from "react";
import NewsCard from "./NewsCard.js";
import { getNewByIdRequest, getNewsRequest } from "@/actions/news.js";
import type { New } from "@/types/dto";
import { Link, Outlet, Route, Routes, useParams } from "react-router-dom";

function NewsSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-accent mb-2">Noticias</h1>
      <p className="text-gray-600 mb-8">
        Mantente actualizado con noticias, anuncios y más de la Asociación de Química UVG
      </p>
      <Outlet/>
    </div>
  );
};

function ListArticles() {
  const [newsItems, setNewsItems] = useState<New[]>([]);

  useEffect(() => {
    async function fetchNews() {
      const [error, news] = await getNewsRequest()
      if (error) {
        console.error("Error fetching news:", error)
        return
      }
      setNewsItems(news)
    };

    void fetchNews();
  }, []);


  return (
    <div className="space-y-8">
      {newsItems.map((item) => {
        const content = item.contenido.split(" ").slice(0, 50).join(" ") + (item.contenido.split(" ").length > 50 ? "..." : "");
        const showReadMore = item.contenido.split(" ").length > 50;

        return (
          <div key={item.id}>
            <NewsCard
              id={item.id}
              title={item.titulo}
              description={content}
              imageUrl={item.img}
              showReadMore={showReadMore}
              createdAt={item.created_at}
            />
          </div>
        );
      })}
    </div>
  )
}

function ArticleDetail() {
  // get id from route params
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<New>(null);

  useEffect(() => {
    async function fetchNew() {
      const [error, news] = await getNewByIdRequest({ id })
      if (error) {
        console.error("Error fetching news:", error)
        return
      }
      setArticle(news)
    }

    void fetchNew();
  }, []);

  if (!article) {
    // @TODO: create a skeleton for this
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-5">
      <Link to="./.."
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors w-fit"
      >
        Volver
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <img
          src={article.img || "/placeholder.svg"}
          alt={article.titulo}
          className="w-full object-cover rounded-t-2xl mb-4"
          style={{ aspectRatio: '16/9' }}
        />
        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 space-y-8">
            <h2 className="text-3xl font-bold mb-4">{article.titulo}</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4 text-justify">{article.contenido}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NewsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NewsSection/>}>
        <Route index element={<ListArticles/>}/>
        <Route path=":id" element={<ArticleDetail/>}/>
      </Route>
    </Routes>
  )
}