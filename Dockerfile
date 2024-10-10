# Giai đoạn 1: Xây dựng ứng dụng React
FROM node:18-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các tệp package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Xây dựng ứng dụng cho môi trường sản xuất
RUN npm run build

# Giai đoạn 2: Phục vụ ứng dụng bằng Nginx
FROM nginx:alpine

# Sao chép kết quả build từ giai đoạn trước vào thư mục mặc định của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Xóa cấu hình mặc định của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Sao chép tệp cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d

# Mở cổng mà Nginx sẽ lắng nghe
EXPOSE 80

# Lệnh khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
