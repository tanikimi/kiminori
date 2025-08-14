+++
draft = false

title = 'Hugoでホームページを自作したよメモ'
date = 2025-08-13T14:00:00+09:00

tags = ["hugo", "web"]

summary = "Hugoでホームページを自作した際の備忘録的なメモです。"
+++

## この記事 is 何

- Hugoでホームページを作りました
- その時に得た知見を雑多にまとめる記事です
- 自己満足です

## そもそもHugoとは

{{<bloglink title="The world's fastest framework for building websites | Hugo" description="Hugo is one of the most popular open-source static site generators. With its amazing speed and flexibility, Hugo makes building websites fun again." url="https://gohugo.io/" image="https://gohugo.io/featured.png">}}

Hugoは、Go製のSSG（_Static Site Generator_）です。SSGは、Markdownとかを投げるといい感じに静的ファイル（HTMLやらCSSやら）を吐き出してくれる便利なフレームワークです。

SSGはHugoの他にも、最近人気の [Astro](https://astro.build/) や なんでも屋の [Next.js](https://nextjs.org/) 、古株の [Gatsby](https://www.gatsbyjs.com/) や [Jekyll](https://jekyllrb.com/) などが有名です。

Hugoはこうした他のSSGと比べ、

- とにかく早い
- シンプルで扱いやすい

という特徴を持っています。特にそのスピードは素晴らしく、Goの高速っぷりを遺憾なく発揮しています。体感ですが、Astroの10倍以上早いです。また、シンプルなのも嬉しいですね。シンプルが故に人気も高く、公式ドキュメント以外に情報をゲットできる手段が多いのもありがたい…！

## 自作テーマの作り方

Hugoにはテーマストアが存在し、数多くのテーマが掲載されています。

{{<bloglink title="Hugo Themes" description="The world’s fastest framework for building websites" url="https://themes.gohugo.io/" image="https://themes.gohugo.io/opengraph/gohugoio-card-base-1_hu_9c01cb56a2662d2e.png">}}

こうした高品質なテーマの多さがHugoの売りの一つではありますが、やっぱりテーマを自作したくなることだってありますよね。少なくとも僕はそうでした。

ありがたいことにHugoでは、自作テーマも非常に簡単に拵えることができます。  
`hugo new theme [自作テーマ名]` を叩くだけで簡単に雛形ができてしまいます。簡単！（生成された雛形の各フォルダ/ファイルの詳細については [公式ドキュメント](https://gohugo.io/templates/) などを見てください）

とはいえ、いきなりできたファイルを触ってテーマを作るのはハードルが高いので、まずは素のHTML/CSSファイルでページを作ってから、それらを分割する形でテーマを作成することをお勧めします。

## JavaScriptについて

HugoでJavaScriptを使うとき、（おま環かもしれませんが）ちょっとクセのある運用が求められます。
Hugoの `themes > [テーマ名] > assets` には `js` フォルダがありますが、ここにJavaScriptファイルをおいてもなぜか**効きません。** 同じ階層の `css` フォルダにCSSファイルをおいたらこっちはちゃんと効くのに…。

そんな時は `themes > [テーマ名] > layouts > static` においてやるとうまくいきます。理由は不明ですが、とにかく効きます。謎。

## ファイルの管理方法

各記事に掲載する写真など、サイトのコンテンツに利用する画像などの各種ファイルを管理する方法は大きく2種類存在します。

一つは先述したJavaScriptと同じ場所、`static` フォルダに置く方法です。Hugoは伝統的にこの方式を採用していたようです。

もう一つは「ページバンドル」。この方式だと、記事ページと同じ階層に各種ファイルを置くことができます。

{{<bloglink title="Page bundles | Hugo" description="Use page bundles to logically associate one or more resources with content." url="https://gohugo.io/content-management/page-bundles/" image="https://gohugo.io/opengraph/gohugoio-card-base-1_hu_7939ed23df672dd1.png">}}

詳しい説明は公式ドキュメントに譲りますが、はまりがちポイントとして `index.md` と `_index.md` を混同してしまうことが挙げられます。**`index.md` を含むディレクトリが Leaf Bundle、`_index.md` を含むディレクトリが Branch Bundle**です。これを間違うと、画像のパスはあっているのに表示されない地獄が展開されることになります…。

## 画像の処理

Hugoには、画像のリサイズやフォーマット変更など、さまざまな処理機能が内蔵されています。

{{<bloglink title="Image processing | Hugo" description="Resize, crop, rotate, filter, and convert images." url="https://gohugo.io/content-management/image-processing/" image="https://gohugo.io/opengraph/gohugoio-card-base-1_hu_9e383b908fa9ddde.png">}}

画像を処理するためにはまず、リソースにアクセスする必要があります。アクセスには [`resources.GetMatch`](https://gohugo.io/functions/resources/getmatch/) を用います。`resources.GetMatch` でパスを指定するとき、[`printf`](https://pkg.go.dev/fmt#Printf) を用いると便利です。

画像のリサイズ・フォーマット変更には [`Resize`](https://gohugo.io/content-management/image-processing/#resize) を用います。

以下に、当サイトでの実装例（記事サムネイル画像表示部）を示します。

{{< highlight go-html-template >}}
{{ $filepath := printf "img/%s.jpg" .Params.thumbnail }}
{{ $alt := printf "「%s」のサムネイル" .Title}}
{{ with .Page.Resources.GetMatch $filepath }}
{{ with .Resize (printf "%dx%d webp" .Width .Height) }}
    <picture>
        <source srcset="{{.RelPermalink}}" type="image/webp">
        <img src="/{{ $filepath }}" alt="{{ $alt }}" loading="lazy">
    </picture>
{{ end }}
{{ end }}
{{< /highlight >}}

当サイトでは、記事のサムネイルに指定する画像ファイル名をフロントマターで指定しているため、それを `.Params.thumbnail` で取得し、それを `printf` で整形したものを 変数 `$filepath` に格納しています。その `$filepath` を `resources.GetMatch` に渡すことでサムネイル画像にアクセスしています。

また、取得した画像は `Resize` で `JPEG` から`WebP` に変換しています。WebPは軽くて素晴らしい。

ちなみに、変換した画像ファイル（今回であればWebP画像）は、デフォルトでは `resources > _gen > images` 配下に格納されます。
ただし、変換後に記事から画像を削除しても残存するので、これを削除するには `hugo --gc` を実行する必要があります。
