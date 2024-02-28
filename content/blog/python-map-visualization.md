---
title: mapboxgl를 사용해 행정구역별 인구 데이터 시각화하기 (feat. geopandas로 shp 읽기, crs 설정)
description: mapbox로 행정구역별 인구 데이터를 시각화해보자. 이 과정에서 geopandas로 행정구역 shp 파일을 읽고, geometry의 crs를 설정하는 방법까지 알아본다.
slug: python-map-visualization
author: 박하람
category: Python
datetime: 2024. 02. 27.
language: Korean
featured: None
tags:
  - mapboxgl
  - geopandas
  - ChoroplethViz
  - crs
---

행정구역과 관련된 데이터는 인구나 면적 등의 데이터와 결합해 지도 시각화를 하는 데 활발히 사용된다. 행정구역과 관련된 다양한 데이터 분석을 진행해봤는데, 그 중에서 행정구역별 인구를 지도에서 시각화한 결과를 보여주는 것이 가장 간단했다. 하지만, mapboxgl을 활용해 시각화를 하는 과정에서 여러가지 삽질을 했다. 특히나, 데이터의 좌표계 설정을 잘 해주지 못해서 끙끙 앓다가 해결했는데 그 과정을 설정한다. 이 포스팅은 행정동을 기준으로 인구를 mapboxgl에 시각화한다.

### 데이터 준비하기

- 행정동별 할당된 인구 데이터는 [행정안전부의 주민등록 인구통계](https://jumin.mois.go.kr/index.jsp)에서 다운로드 받을 수 있다. 제공하는 데이터 중에서 주민등록 인구 및 세대현황 데이터를 활용했고, '전체읍면동현황'을 클릭하고 'xlsx 파일 다운로드'를 했다. xlsx로 파일을 다운로드받으면, 행정기관코드와 함께 총 인구수 데이터를 얻을 수 있다. 여기에서 행정기관코드는 행정동코드다.
- 행정동별 경계 데이터는 [주소기반산업지원서비스의 구역의 도형](https://business.juso.go.kr/addrlink/elctrnMapProvd/geoDBDwldList.do?menu=%EA%B5%AC%EC%97%AD%EC%9D%98%20%EB%8F%84%ED%98%95)에서 다운로드 받을 수 있다. '구역의 도형활용' 버튼을 클릭하면, 개별 테이블별로 레이아웃을 확인할 수 있다. 법정구역에서 행정동 (TL_SCCO_GEMD) 레이아웃이 행정동 경계를 제공한다. 이 때, 행정동 경계 geometry의 CRS는 `EPSG:5179`다.

### 데이터 불러오기

데이터를 불러오는 코드는 다음과 같다. 엑셀 파일은 `pandas`로 불러오면 되고, shp 파일은 `geopandas`로 불러올 수 있다. 구역의 도형 데이터는 인코딩을 `cp949`로 설정하면 된다.

```py
import pandas as pd
import geopandas as gpd

df1 = pd.read_excel('data/population.xlsx')
df2 = gpd.read_file('data/26000/TL_SCCO_GEMD.shp', encoding="cp949")
```

### 데이터 정제와 병합

구역의 도형 데이터는 읍면동 데이터를 모두 포함하고 있기 때문에, 읍과 면을 제거한다. 인구와 shp 파일을 병합하기 위해 행정동코드의 컬럼명을 통일한다. 다음은 행정동코드를 기준으로 데이터를 병합한다.

```py
# 읍과 면을 제거하고 동만 남기기
df2 = df2[(df2["EMD_KOR_NM"]).str.endswith("동")]

# 행정동코드의 컬럼명 통일하기
df1.rename(columns={'행정기관코드':'행정동코드'}, inplace=True)
df2.rename(columns={'EMD_CD':'행정동코드'}, inplace=True)

# 행정동코드 기준으로 병합하기
merged = df1.merge(df2, on='행정동코드')
```

### CRS 설정하기

CRS를 설정하려면, 병합된 데이터를 `GeoDataFrame`으로 설정해야 한다. 변환해준 다음에 geometry에 대한 CRS 설정이 필요하다. 구역의 도형의 기본 CRS는 `EPSG:5179`다. mapbox의 좌표계는 `EPSG:4326`이기 때문에, 좌표계를 바꿔줘야 한다. 변환 과정은 먼저 CRS를 `EPSG:5179`로 설정해주고, `EPSG:4326`으로 변경한다. 이 때, 바로 `EPSG:4326`로 변환하면 안되고 !!! `EPSG:5179`로 설정해준 다음에 변환하는 것이 필수다. mapboxgl은 geojson 파일을 읽기 때문에 변환된 파일은 `geojson`으로 저장한다.

```py
# GeoDataFrame으로 변환
gdf = gpd.GeoDataFrame(merged)

# CRS 변환
gdf = gdf.set_crs(epsg=5179)
gdf = gdf.to_crs(epsg=4326)

# CRS 확인
print(gdf.crs)
# <Geographic 2D CRS: EPSG:4326>
# Name: WGS 84
# Axis Info [ellipsoidal]:
# - Lat[north]: Geodetic latitude (degree)
# - Lon[east]: Geodetic longitude (degree)
# Area of Use:
# - name: World.
# - bounds: (-180.0, -90.0, 180.0, 90.0)
# Datum: World Geodetic System 1984 ensemble
# - Ellipsoid: WGS 84
# - Prime Meridian: Greenwich

# 파일 저장하기
gdf.to_file('busan-geoj.geojson', driver="GeoJSON")
```

### mapbox로 지도 시각화하기

mapbox를 사용하려면 토큰을 발급해야 한다. mapbox에서 토큰을 받은 후 다음과 같이 토큰을 설정한다(`.env` 파일에 토큰을 저장해 불러와도 된다). 그 다음은 geojson 파일을 불러온다.

```py
# 토큰 설정하기
token = '************'

# geojson 파일 열기
geo_data = 'busan-geoj.geojson'

with open(geo_data, 'rt', encoding='utf-8') as f:
    gj = geojson.load(f)
```

다음은 mapboxgl로 지도 시각화를 하는 코드다. 이 코드는 전반적으로 [[지도 데이터 시각화] Part 5. Mapboxgl 살펴보기](https://dailyheumsi.tistory.com/145)를 참고했다. `ChoroplethViz`에서 `data`는 `gj`로 설정해주고, `color_property`는 인구 데이터에 해당하는 컬럼명을 설정한다.

```py
from mapboxgl.utils import create_color_stops

# 부산 중심부의 경도와 위도
center = [129.05562775, 35.1379222]

# 색상의 범주 지정
color_breaks = [0, 10000, 20000, 30000, 40000, 50000, 60000]
color_stops = create_color_stops(color_breaks, colors='BuPu')

# ChoroplethViz 그리기
viz = ChoroplethViz(
    access_token=token,
    data=gj,
    color_property='population',
    color_stops=color_stops,
    center=center,
    zoom=10)

# 맵 출력
viz.show()
```

위의 코드의 결과는 다음 그림과 같다. 색이 진한 곳이 읍면동별로 인구가 많은 곳이다.

![map viz](/python-map-visualization/map1.png)

위의 결과가 더 입체적으로 보이고 싶다면, 다음의 코드로 시각화하면 된다. 맵을 -15도만큼 좌우회전하고, 45도만큼 상하 회전한 다음 인구를 기준으로 높이를 부여한다(`viz.height_property`).

```py
from mapboxgl.utils import create_numeric_stops

viz.bearing = -15
viz.pitch = 45

viz.height_property = 'population'

numeric_stops = create_numeric_stops([0, 10000, 20000, 30000, 40000, 50000, 60000], 0, 3000)

viz.height_stops = numeric_stops
viz.height_function_type = 'interpolate'

viz.show()
```

결과는 다음과 같이 행정동별 인구가 입체적으로 시각화된다.

![map viz2](/python-map-visualization/map2.png)

마무리하면 시각화는 그렇게 어렵지 않은데, 데이터를 mapboxgl에 맞게 준비하는 과정이 오래 걸린다. 특히, 좌표계를 변환하는 과정과 geojson으로 데이터를 준비하는 과정이 꽤나 지난했다. 여러분들은 저처럼 삽질을 하지 마시길...🥲
