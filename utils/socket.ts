// websocket.ts
class WebSocketService {
  private socketTask: UniApp.SocketTask | null = null;
  private isConnected: boolean = false;
  private url: string;
  private heartbeatInterval: number = 30000; // 心跳间隔，毫秒
  private reconnectInterval: number = 5000; // 重连间隔，毫秒
  private heartbeatTimer: number | null = null;
  private reconnectTimer: number | null = null;

  constructor(url: string) {
    this.url = url;
  }

  // 初始化 WebSocket 连接
  public init() {
    this.connect();
  }

  // 建立 WebSocket 连接
  private connect() {
    if (this.isConnected) return;

    this.socketTask = uni.connectSocket({
      url: this.url,
      success: () => {
        console.log('WebSocket 连接成功');
        this.isConnected = true;
        this.startHeartbeat();
      },
      fail: (error) => {
        console.error('WebSocket 连接失败', error);
        this.reconnect();
      },
    });

    this.socketTask.onOpen(() => {
      console.log('WebSocket 已打开');
      this.isConnected = true;
      this.startHeartbeat();
    });

    this.socketTask.onMessage((res) => {
      console.log('收到服务器消息：', res.data);
      this.handleMessage(res.data);
    });

    this.socketTask.onError((error) => {
      console.error('WebSocket 错误', error);
      this.isConnected = false;
      this.reconnect();
    });

    this.socketTask.onClose(() => {
      console.log('WebSocket 已关闭');
      this.isConnected = false;
      this.stopHeartbeat();
      this.reconnect();
    });
  }

  // 处理接收到的消息
  private handleMessage(data: any) {
    // 在此处理服务器推送的实时数据
    // 可以根据业务需求进行解析和处理
	console.log(data)
  }

  // 发送消息
  public sendMessage(data: any) {
    if (this.isConnected && this.socketTask) {
      this.socketTask.send({
        data: JSON.stringify(data),
        success: () => {
          console.log('消息发送成功');
        },
        fail: (error) => {
          console.error('消息发送失败', error);
        },
      });
    } else {
      console.warn('WebSocket 未连接，无法发送消息');
    }
  }

  // 开始心跳检测
  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.sendMessage({ type: 'heartbeat' });
      }
    }, this.heartbeatInterval);
  }

  // 停止心跳检测
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 尝试重连
  private reconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      console.log('尝试重新连接...');
      this.connect();
      this.reconnectTimer = null;
    }, this.reconnectInterval);
  }

  // 关闭 WebSocket 连接
  public close() {
    if (this.socketTask) {
      this.socketTask.close({
        success: () => {
          console.log('WebSocket 连接已关闭');
          this.isConnected = false;
          this.stopHeartbeat();
        },
        fail: (error) => {
          console.error('关闭 WebSocket 连接失败', error);
        },
      });
    }
  }
}

export default WebSocketService;